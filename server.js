import express from "express";
import cookieParser from "cookie-parser";

import { Liquid } from "liquidjs";

// Vul hier jullie team naam in
const teamName = "Hype";

// Zet de personResponse globaal
const personResponse = await fetch(
  "https://fdnd.directus.app/items/person/?sort=name&fields=*,squads.squad_id.name,squads.squad_id.cohort&filter={%22_and%22:[{%22squads%22:{%22squad_id%22:{%22tribe%22:{%22name%22:%22FDND%20Jaar%201%22}}}},{%22squads%22:{%22squad_id%22:{%22cohort%22:%222425%22}}},{%22squads%22:{%22squad_id%22:{%22name%22:%221G%22}}}]}"
);
const { data: persons } = await personResponse.json();

const processedPeople = persons.map((person) => {
  try {
    const capitalizedParts = person.name
      .split(" ") // Split de naam in verschillende delen
      .filter((part) => /^[A-Z]/.test(part)); // Test of de eerste letter een hoofdletter is

    return {
      firstName: capitalizedParts[0],
      lastName: capitalizedParts.slice(1).join(' '),
      fullName: (capitalizedParts[0] + capitalizedParts[1].slice(0, 2)).toLowerCase(),
    };
  } catch (error) {
    // In het geval dat een naam niet correct is krijg je er een error over en wordt er een lege string gereturned
    // Zorgt ervoor dat de loop niet stopt
    console.error("Error processing person:", {
      error: error.message,
      person: person,
      name: person?.name || "No name found",
    });
    return {
      firstName: "",
      lastName: "",
      fullName: "",
    };
  }
});

// Selecteer een willekeurige persoon uit de processedPeople array
const {firstName, lastName} = processedPeople[Math.floor(Math.random() * processedPeople.length)];
const randomPerson = `${firstName} ${lastName.slice(0, 2)}`;
const app = express();

// Zet logged op null als initiële state
let logged = null;

app.use(express.static("public"));

const engine = new Liquid();
app.engine("liquid", engine.express());

app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));

// Maakt het leven makkelijker met cookies
app.use(cookieParser());

// Update logged als deze in de cookies staat
app.use((request, response, next) => {
  // Zo weten wie er ingelogd is
  logged = request.cookies.logged;
  next();
});

// Tussenstukje om te checken of iemand ingelogd is
app.use((request, response, next) => {
  // Skip authentication for login page and its assets
  if (request.path === "/login" || request.path.startsWith("/public")) {
    return next();
  }

  // Redirect to login if not logged in
  if (!logged) {
    return response.redirect("/login");
  }
  next();
});

// ophalen van mensen uit 1G
const squadResponse = await fetch(
  'https://fdnd.directus.app/items/squad?filter={"_and":[{"cohort":"2425"},{"tribe":{"name":"FDND Jaar 1"}}]}'
);
const { data: squads } = await squadResponse.json();
let sortLikes;
app.get("/", async function (request, response) {
  sortLikes = request.query.sort; //sorteren

  // Haal alle likes op
  const hypeLikes = await fetch(
    `https://fdnd.directus.app/items/messages/?filter={"for":"Team Hype Likes"}`
  );
  const { data: allLikes } = await hypeLikes.json();

  // Tel alle likes per persoon en check persoonlijke likes
  const likeCounts = {};
  const personalLikes = [];
  allLikes.forEach((like) => {
    likeCounts[like.text] = (likeCounts[like.text] || 0) + 1;
    if (like.from === logged) {
      personalLikes.push(Number(like.text));
    }
  });

  //
  let sortedPersons = [...persons];

  if (sortLikes === "likes-descending") {
    sortedPersons.sort(
      (a, b) => (likeCounts[b.id] || 0) - (likeCounts[a.id] || 0)
    );
  } else if (sortLikes === "likes-ascending") {
    sortedPersons.sort(
      (a, b) => (likeCounts[a.id] || 0) - (likeCounts[b.id] || 0)
    );
  }

  // Haal teamberichten op
  const messagesResponse = await fetch(
    `https://fdnd.directus.app/items/messages/?filter={"for":"Team Hype"}&sort=-date_created`
  );
  const { data: messages } = await messagesResponse.json();

  // Check wie er ingelogd is
  const currentUser = processedPeople.find(person => 
    (person.fullName === logged)
  );

  // Volle naam van de ingelogde gebruiker
  const loggedInName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : null;

  response.render("index.liquid", {
    teamName,
    persons: sortedPersons,
    squads,
    messages,
    likes: JSON.stringify(personalLikes),
    likeCounts,
    sortLikes,
    loggedInName
  });
});

//route aanmaken voor studentpagina
app.get("/student/:id", async function (request, response) {
  const personDetailResponse = await fetch(
    `https://fdnd.directus.app/items/person/${request.params.id}`
  );
  const { data: person } = await personDetailResponse.json();

  // filter op datum zodat je makkelijk meest recente bericht kan laten zien
  const messagesResponse = await fetch(
    `https://fdnd.directus.app/items/messages/?filter={"for":"${request.params.id}"}&fields=*,created`
  );
  const { data: messages } = await messagesResponse.json();

  //sorter zodat je nieuwste bericht kan tonen
  const sortedMessages = messages.sort(
    (a, b) => new Date(b.created) - new Date(a.created)
  );

  // Pak het nieuwste bericht
  const latestMessage = sortedMessages.length > 0 ? sortedMessages[0] : null;

  response.render("student.liquid", {
    person,
    squads,
    messages, // Stuur alleen berichten voor deze student
  });
});

//posten voor op de studentenpagina
app.post("/student/:id", async function (request, response) {
  // Bericht toevoegen aan de Directus API
  await fetch("https://fdnd.directus.app/items/messages/", {
    method: "POST",
    body: JSON.stringify({
      for: request.params.id,
      text: request.body.message,
    }),
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  // Redirect naar de studentpagina om het nieuwste bericht weer te geven
  response.redirect(303, `/student/${request.params.id}`);
});

app.get("/login", function (request, response) {
  response.render("login.liquid", {
    randomPerson
  });
});

app.post("/login", async function (request, response) {
  // Haal de input op van de login pagina
  const inputName = request.body.naam;

  if (!inputName) {
    return response.render("login.liquid", {
      error: "Voer een naam in",
      randomPerson
    });
  }

  // Zet de input om naar lowercase en verwijder spaties
  const normalizedInput = inputName.toLowerCase().replace(/\s+/g, "");

  // Match de input met een van de personen in de processedPeople array
  const validUser = processedPeople.find((person) => {
    const validLogin = `${person.fullName}`;
    return validLogin === normalizedInput;
  });

  if (validUser) {
    // Als de input overeenkomt met een van de personen in de processedPeople array, maak een cookie aan met hun naam
    // en behoud deze cookie voor 1 jaar
    response.cookie("logged", normalizedInput, {
      maxAge: 34560000,
      httpOnly: true,
    });

    // Log de ingelogde gebruiker in de team database
    await fetch("https://fdnd.directus.app/items/messages/", {
      method: "POST",
      body: JSON.stringify({
        for: `Team ${teamName}`,
        from: "Systeem",
        text: `${normalizedInput} is ingelogd!`,
      }),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    return response.redirect(303, "/");
  } else {
    // Als de input niet overeenkomt met een van de personen in de processedPeople array, geef een error
    return response.render("login.liquid", {
      error: "Ongeldige login. Probeer opnieuw.",
      inputName,
      randomPerson
    });
  }
});

app.get("/logger", async function (request, response) {
  // Haal berichten op voor het team
  const messagesResponse = await fetch(
    `https://fdnd.directus.app/items/messages/?filter={"for":"Team ${teamName}"}`
  );
  const { data: messages } = await messagesResponse.json();

  response.render("logger.liquid", {
    teamName,
    squads,
    messages,
  });
});

app.post("/logger", async function (request, response) {
  await fetch("https://fdnd.directus.app/items/messages/", {
    method: "POST",
    body: JSON.stringify({
      for: request.params.id,
      text: request.body.message,
    }),
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });

  response.redirect("/");
});

// Add logout route
app.get("/logout", (request, response) => {
  // Clear de cookie
  response.clearCookie("logged");
  // Reset logged
  logged = null;
  // Redirect naar de login pagina
  response.redirect("/login");
});
// -- POST route:
// hier wordt eerst gekeken of er al een like status is voor de persoon. Zo niet, dan wordt deze op 0 gezet.
// dan wordt de like status met 1 verhoogd met ++, en wordt de nieuwe status opgeslagen in het likes object.
// vervolgens wordt de nieuwe like status geprint in de console.
// tot slot wordt de gebruiker geredirect naar de homepage.

app.post("/like", async function (request, response) {
  let personId = request.body.person_id;

  // Data om te vergelijken
  const compareData = await fetch(
    `https://fdnd.directus.app/items/messages/?filter={"for":"Team Hype Likes"}`
  );
  const compareJson = await compareData.json();

  // vergelijking, als het bestaat, pak de id en delete gebaseerd hierop
  const itemToDelete = compareJson.data.find(
    (person) => person.from === logged && person.text === personId
  )?.id;

  if (itemToDelete) {
    // Als er een item is, delete het
    await fetch(
      `https://fdnd.directus.app/items/messages/${itemToDelete}?filter={"for":"Team Hype Likes"}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    );

    return response.redirect(303, `/${sortLikes ? `?sort=${sortLikes}` : ""}`);
  }

  // like by default
  await fetch(
    `https://fdnd.directus.app/items/messages/?filter={"for":"Team Hype Likes"}`,
    {
      method: "POST",
      body: JSON.stringify({
        for: `Team Hype Likes`,
        text: personId,
        from: logged,
      }),
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    }
  );

  response.redirect(303, `/${sortLikes ? `?sort=${sortLikes}` : ""}`);
});

app.set("port", process.env.PORT || 8000);

if (teamName == "") {
  console.log("Voeg eerst de naam van jullie team in de code toe.");
} else {
  app.listen(app.get("port"), function () {
    console.log(`Application started on http://localhost:${app.get("port")}`);
  });
}
