## Squadpage team Hype 
Welkom op de squadpage van team Hype. Een dynamische website waarbij je squadleden kunt bekijken, likes kunt geven en berichten kunt achterlaten. Onze website biedt een overzicht van iedereen in de squad, compleet met een profielkaart en de mogelijkheid om interactie aan te gaan.

[Bekijk onze squadpage!](https://connect-your-tribe-team-squad-page-72f1.onrender.com/)

## Beschrijving
`Inloggen is simpel:` vul je voornaam en de eerste twee letters vanje achternaam in. Eenmaal ingelogd kom je op de overzichtspagina, waar je alle squadleden ziet. Je kunt een like achterlaten als je iemand wilt waarderen en berichten plaatsen op hun profielpagina. Alles wordt netjes opgeslagen, zodat je kunt zien wie de meeste likes heeft en wat er wordt gezegd!

<details><summary>Tutorials</summary>
login: 
  
https://github.com/user-attachments/assets/62309719-68f8-47e8-9eed-8e0bfac62500


overzicht:

https://github.com/user-attachments/assets/26860199-a2fc-4aa9-bf79-1f1137d5eab2


liken en filteren:

https://github.com/user-attachments/assets/157b1490-3fec-45c6-a23e-01a3c9441aab

detail pagina & berichten achterlaten:

https://github.com/user-attachments/assets/c0c92a23-a184-4290-a5dc-d0cd78f1e407


</details>


### Teamleden & bijdragen
#### [Amber](https://github.com/ambersr)


Op de Squadpage heb ik een aandeel gehad in de ontwerpkeuzes. Denk bijvoorbeeld aan de styling van de inlogpagina en overige pagina's van de squadpage en de opbouw van de stylesheet dat alle huisstijl elementen bevat. Daarnaast heb ik de opzet gemaakt voor alle HTML en styling bestanden.

**Ontwerpkeuzes**

Styling
<br>
De kleuren op de squadpage bevatten de kleuren van het huisstijl. De belangrijkste elementen zoals de studenten cards en de buttons hebben een glass effect en bevatten een ronde border dit zorgt voor consistentie. Ook tussenruimtes (padding) wordt consistent doorgevoerd en zorgt ervoor dat de website een clean uiterlijk heeft.

<img width="400" alt="image" src="https://github.com/user-attachments/assets/fdafc4c2-c147-4817-bc89-f503212c79f7" />
<img width="400" alt="image" src="https://github.com/user-attachments/assets/3dd0bd43-4b9d-453c-bda0-688d4bb17940" />
<br></br>
Functionaliteit
<br>
Het ontwerp is goed doordacht aan de hand van een styleguide i.c.m een stylesheet waar de styling wordt vastgesteld. Daarnaast is het de squadpage mobile first ontwikkeld en werken de studenten cards aan de hand van grid helemaal responsive.
<br></br>

https://github.com/user-attachments/assets/f6ef934f-52f0-4a3d-9312-605b86d8ef2e

De filterfunctie is opgebouwd aan de hand van een `<detail>` met een `<summary>`, deze heb ik aan de hand van de pseudo element een animatie gegeven.

https://github.com/user-attachments/assets/17d5df3b-8019-42ba-ba97-b63479fa0110

#### [Colin](https://github.com/ColindeGroot)

Op de squapage heb ik een formulier gebouwd met een textarea waar mensen een bericht kunnen achterlaten op een persoon. Dit is gedaan met een post route waarbij ik het toevoeg aan de messages in de directus:

```js
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
```

het formulier in de liquid file word met een post methode aan de juiste studentpagina. In dezelfde file heb ik een item gemaakt waar ik het meest recente bericht laat zien. Ik laat ze niet allemaal zien omdat het dan niet mooi past op de website:

```liquid
<ul>
        {% if messages.size > 0 %}
        <li>{{ messages[0].text }}</li> <!-- Nieuwste bericht -->
        {% else %}
        <li>Er zijn nog geen berichten. Plaats iets leuks!</li>
        {% endif %}
    </ul>

    <form method="POST" action="/student/{{ person.id }}">

        <label for="">typ iets leuks  </label>
        <textarea placeholder="Typ iets leuks :D" name="message" id="" required></textarea>
        <button method="submit">post bericht</button>

    </form>
```

Omdat [0] normaal het eerste/oudste bericht laat zien heb ik het gefilterd op date zodat het filtert op meest recente berichten:
```js
  // filter op datum zodat je makkelijk meest recente bericht kan laten zien
  const messagesResponse = await fetch(
    `https://fdnd.directus.app/items/messages/?filter={"for":"${request.params.id}"}&fields=*,created`
  );
  const { data: messages } = await messagesResponse.json();
```

Daarnaast heb ik de filter op de homepage werkend gemaakt. In de liquid heb ik een link toegevoegd aan de li's in de summary voor de filter.
``` liquid
  <details class="details">
    <summary>Filter op likes</summary>
    <ul class="details-content">
      <li><a href="?sort=likes-descending">Likes hoog - descending</a></li>
      <li><a href="?sort=likes-ascending">Likes laag - ascending</a></li>
    </ul>
  </details>
```

En in de js heb ik een filter gemaakt waarbij je filtdert op aantal likes:

```js
 if (sortLikes === "likes-descending") {
    sortedPersons.sort(
      (a, b) => (likeCounts[b.id] || 0) - (likeCounts[a.id] || 0)
    );
  } else if (sortLikes === "likes-ascending") {
    sortedPersons.sort(
      (a, b) => (likeCounts[a.id] || 0) - (likeCounts[b.id] || 0)
    );
  }
```

Verder heb ik de studentpage verder gestyled en de css opgeschoond waarbij ik onnodige css heb verwijderd, nieuwe classes heb geschreven beter heb genest en meer responsive units heb toegevoegd.

#### [Marcin](https://github.com/MarsGotBars)
Grotendeels heb ik me beziggehouden met het inlogsysteem, like systeem, algemene code refactoring en de kaart animaties.

##### Inlogsysteem
D.M.V. cookie parser te gebruiken, sla ik in een cookie op wie inlogt, dit wordt ook 'gevalideert' door gebruik te maken van de lijst van studenten.

Zo moeten gebruikers hun volle naam en eerste 2 letters van hun achternaam invullen om in te loggen, casing maakt hierbij niet uit aangezien ik dit allemaal omzet naar lowercase.

<details><summary>Codebreakown inlogsysteem</summary>
  
<sub>Snippet waarbij ik gebruik maak van de persons data om alle valide gebruikers te verwerken en op te slaan</sub>
  
```js
const personResponse = await fetch(
  "https://fdnd.directus.app/items/person/?sort=name&fields=*,squads.squad_id.name,squads.squad_id.cohort&filter={%22_and%22:[{%22squads%22:{%22squad_id%22:{%22tribe%22:{%22name%22:%22FDND%20Jaar%201%22}}}},{%22squads%22:{%22squad_id%22:{%22cohort%22:%222425%22}}},{%22squads%22:{%22squad_id%22:{%22name%22:%221G%22}}}]}"
);
const { data: persons } = await personResponse.json();

const processedPeople = persons.map((person) => {
  try {
    const capitalizedParts = person.name
      .split(" ") // Split de naam in verschillende delen
      .filter((part) => /^[A-Z]/.test(part)) // Test of de eerste letter een hoofdletter is
      .map((part) => part.toLowerCase()); // Zet alle resterende letters naar lowercase

    return {
      firstName: capitalizedParts[0],
      // Pak de eerste 2 letters van de achternaam
      lastName: capitalizedParts[1],
      fullName: capitalizedParts[0] + capitalizedParts[1].slice(0, 2)
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
      processedName: "",
      fullName: ""
    };
  }
});
```

<sub>Snippet waarbij ik gebruik maak van `next()` om te checken of de gebruiker werkelijk is ingelogd of niet, als niet dan wordt deze _altijd_ naar /inlog ge-redirect</sub>

```js
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
```

<sub>Snippet van de daadwerkelijke inlog, in de post word alle ingevulde data verwerkt en gematched met de correcte processedPeople.fullName variabele</sub>

```js
app.get("/login", async function (request, response) {
  if (logged) return response.redirect(303, "/");

  response.render("login.liquid");
});

app.post("/login", async function (request, response) {
  // Haal de input op van de login pagina
  const inputName = request.body.naam;

  if (!inputName) {
    return response.render("login.liquid", {
      error: "Voer een naam in",
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
      inputName
    });
  }
});
```

</details>

Ook krijgt de gebruiker een `error` message als de input leeg is of als de naam verkeerd is.
In het geval dat de naam verkeerd is blijft de foute waarde staan na page reload dmv inputName op de value te zetten

De nette form styling is te danken aan [Nadira](https://github.com/Naddybsx).

##### Like systeem
Na wat input van Dion hebben we besloten om gebruik te maken van een andere api route ipv de custom op alle gebruikers, dit om fouten / data-loss te voorkomen

<details><summary>Code breakdown like systeem</summary>

<sub>Snippet van de like post, zo wordt de data opgeslagen in de velden: for (ons team), text (de id van het gelikede persoon), from (wie hen heeft geliked)</sub>

<sub>Eerst wordt er gecheckt, met behulp van de compareJson, of persoon x persoon y al heeft geliked, hier gebruiken we de `find()` functie voor, als itemToDelete data bevat, wordt dat object verwijdert gebaseerd op het gevonden ID</sub>

```js
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
    // Wait for the delete operation to complete
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
```

<sub>Ook heb ik ervoor gezorgd dat als je had gefiltered (op likes - ascending of likes - descending), dat je ook op dat filter zou blijven door dit globaal te onthouden en weer door te geven</sub>

```js
return response.redirect(303, `/${sortLikes ? `?sort=${sortLikes}` : ""}`);
```

</details>

##### Code refactoring
In vele plekken heb ik de code verbeterd / aangepast zodat het makkelijker te gebruiken was en/of leesbaarder was, zo heb ik bijvoorbeeld de props korter gemaakt:

[Refactor commit](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/commit/3b76005b13941888f6c263f3e40905f0b4f78150#diff-a4c65ede64197e1a112899a68bf994485b889c4b143198bac4af53425b38406fL112-R118)

<details><summary>Voorbeeld: voor refactor:</summary>

![Image](https://github.com/user-attachments/assets/f84c2594-8a6d-4427-8c9b-f196fdf24c57)

</details>

<details><summary>Voorbeeld: na refactor:</summary>

![Image](https://github.com/user-attachments/assets/d7d94c36-758c-492f-9eac-e6c68e37308b)

</details>

##### Animatie
Hiervoor heb ik een `observer()` gebruikt en heb ik ervoor gezorgd dat ze gelijdelijk maar ook op random delays verschijnen door gebruik te maken van een `setTimeout()`
[Animatie commit](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/commit/09061934772d96d7af82234765a289ca4c43d0c0)

https://github.com/user-attachments/assets/0aecb5d9-cb2f-4ea2-b226-cb09198f6295



#### [Nadira](https://github.com/Naddybsx)

https://github.com/user-attachments/assets/1910acc7-bbe9-4bf4-9741-62274803e890

Ik heb me voornamelijk bezig gehouden met het opzetten van de like funcionaliteit. Dit begon met een [breakdownschets](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/issues/2#issue-2874469481) van de homepagina en een [wireflow](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/issues/2#issue-2874469481) van de like interactie. Mijn doel was om een [POST verzoek](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/commit/0102e10a6471d78118698cb0c879c6d8e667bbc9) te maken waarmee gebruikers een like kunnen achterlaten bij squadleden, en deze data dynamisch weer te geven met liquid. Ik implementeerde een [likes object](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/commit/159a5ebd62534b9b9222e85d40eb31c7a8e18ea6) op de server, [verwerkte](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/commit/a35414fbe450b91854b7275a0139db5bfbe32c7c) de interacties en zorgde ervoor dat het juiste aantal likes werd [opgeslagen](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/commit/0102e10a6471d78118698cb0c879c6d8e667bbc9) en [weergegeven](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/commit/0102e10a6471d78118698cb0c879c6d8e667bbc9). Daarnaast werkte ik aan de [styling](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/commit/5ccc048cf6a47f8df766be74719c4537802cf3d9) en positionering van de like knop. [Marcin](https://github.com/MarsGotBars) hielp mij verder bij het uitbreiden van de functie met het [koppelen](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/commit/7eb1d40168d6e8f8703225292b709c6a40f4af7e) van ingelogde gebruikers.
- [Deze link bevat een uitgebreide documentatie van hoe ik dit heb geimplementeerd in code met de bijbehorende commits!](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/issues/6#issuecomment-2684170319)

## Kenmerken
`Onze squadpage is gebouwd met de volgende technieken:` Klik op de linkjes om meer te leren over wat deze technieken inhouden en hoe je het kunt gebruiken :)
- [`Node.js`](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) & [`Express`](https://www.geeksforgeeks.org/express-js/): De basis van onze server en routing.
- [`LiquidJS`](https://liquidjs.com/tutorials/intro-to-liquid.html): Voor het dynmisch renderen van HTML.
- [`Directus API`](https://docs.directus.io/getting-started/quickstart.html): opslag en ophalen van squadleden, berichten en likes.
- [`Cookie parser`](https://www.geeksforgeeks.org/express-cookie-parser-signed-and-unsigned-cookies/): Maakt het makkelijk om cookies op te slaan en te gebruiken, gebruikt voor het inloggen.

### Hoe werkt de server?
Onze server draait op `Node.js` en `Express` en verwerkt alle inkomende `HTTP verzoeken`. 

Hier is een overzicht van hoe dit werkt:
1. `Data ophalen`: De server haalt gegevens op via `fetch()` aanvragen aan de `Directus API`. Dit gebeurt voor squadleden, berichten en likes.
2. `Data verwerken`: We koppelen de opgehaalde data aan de juiste personen, berekenen likes per persoon en filterengegevens.
3. `HTML genereren`: Met `LiquidJS` geven we de opgehaalde data door aan onze templates, zodat de pagina's dynamisch gegenereerd worden met de juiste inhoud.
4. `State beheren`: Met `cookies` slaan we inloggegevens en voorkeuren van gebruikers op.

### Routes en dataverwerking
Onze server maakt gebruik van verschillende `routes` om data op te halen, te verwerken en weer te geven.
Zie hieronder hoe wij specifieke data hebben opgehaald en verwerkt via verschillende routes:
- [app.get("/")](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/blob/39d4fbd10823e3a7563c20540a1ca2c9a7795e44/server.js#L88-L128) : Laadt de squadpage met alle personen, likes en filterfunctionaiteit. Data wordt opgehaald via; `https:fdnd.directus.app/items/person/`
- [app.get("/login)](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/blob/39d4fbd10823e3a7563c20540a1ca2c9a7795e44/server.js#L176-L180) : Laadt de inlogpagina
- [app.post("/login")](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/blob/39d4fbd10823e3a7563c20540a1ca2c9a7795e44/server.js#L182-L229) : Verwerkt de inloggegevens en slaat de gebruiker op in een cookie. De login wordt gevalideerd aan de hand van `processedPeople`.
- [app.get("/student/:id")](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/blob/39d4fbd10823e3a7563c20540a1ca2c9a7795e44/server.js#L131-L154) : Laadt de detailpagina van een persoon, incl hun profiel en berichten. Berichten worden gesorteerd op datum, waarbij het nieuwste bericht bovenaan staat.
- [app.post("/student:id")](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/blob/39d4fbd10823e3a7563c20540a1ca2c9a7795e44/server.js#L157-L172) : Voegt een bericht toe aan een persoon en slaat deze op.
- [app.post:("/like")](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/blob/39d4fbd10823e3a7563c20540a1ca2c9a7795e44/server.js#L275-L321) : Voegt een like toe of verwijdert deze als de gebruiker al heeft geliket. Een gebruiker kan slechts één like per persoon toevoegen of verwijderen.

## Installatie

### Scripts
#### `npm i` of `npm install`
Hiermee installeer je de benodigde packages zoals express & cookie-parser.

#### `npm start`
Hiermee start je het project.

Open vervolgens [http://localhost:8000](http://localhost:8000) om het project te zien in de browser.

Om edits te zien moet je de pagina refreshen omdat het geen hot-reload bevat.

`console.log`'s in de `server.js` worden in de editor console weergeven, niet de browser.

