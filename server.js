import express from 'express'
import cookieParser from 'cookie-parser'

import { Liquid } from 'liquidjs';

// Vul hier jullie team naam in
const teamName = 'Hype';

// Zet de personResponse globaal
const personResponse = await fetch('https://fdnd.directus.app/items/person/?sort=name&fields=*,squads.squad_id.name,squads.squad_id.cohort&filter={%22_and%22:[{%22squads%22:{%22squad_id%22:{%22tribe%22:{%22name%22:%22FDND%20Jaar%201%22}}}},{%22squads%22:{%22squad_id%22:{%22cohort%22:%222425%22}}},{%22squads%22:{%22squad_id%22:{%22name%22:%221G%22}}}]}');
const personResponseJSON = await personResponse.json();

let likes = {}; // -- likes object wordt aangemaakt om de like status per persoon bij te houden

const processedPeople = personResponseJSON.data.map((person) => {
  try {
    const capitalizedParts = person.name
      .split(' ') // Split de naam in verschillende delen
      .filter(part => /^[A-Z]/.test(part)) // Test of de eerste letter een hoofdletter is
      .map(part => part.toLowerCase()); // Zet alle resterende letters naar lowercase
    
    return {
      first_name: capitalizedParts[0],
      // Pak de eerste 2 letters van de achternaam
      processedName: capitalizedParts[1].slice(0, 2)
    };
  } 
  // In het geval dat een naam niet correct is krijg je er een error over en wordt er een lege string gereturned
  // Zorgt ervoor dat de loop niet stopt
  catch (error) {
    console.error('Error processing person:', {
      error: error.message,
      person: person,
      name: person?.name || 'No name found'
    });
    return {
      first_name: '',
      processedName: ''
    };
  }
});
// console.log(processedPeople);
// console.log(personResponseJSON.data);
const app = express()

// Declare logged variable to store the logged-in user (null when no one is logged in)
let logged = null;  // Initialize as null when no user is logged in

app.use(express.static('public'))

const engine = new Liquid();
app.engine('liquid', engine.express()); 

app.set('views', './views')

app.use(express.urlencoded({extended: true}))

// Maakt het leven makkelijker met cookies
app.use(cookieParser())

// Update the logged variable to read from cookies
app.use((request, response, next) => {
  // Zo weten wie er ingelogd is
  logged = request.cookies.logged
  next()
})

// Tussenstukje om te checken of iemand ingelogd is
app.use((request, response, next) => {
  // Skip authentication for login page and its assets
  if (request.path === '/login' || request.path.startsWith('/public')) {
    return next()
  }
  
  // Redirect to login if not logged in
  if (!logged) {
    return response.redirect("/login")
  }
  console.log(logged, 'logged')
  next()
})

// Haal alle studenten uit squad G1 op
const squadResponse = await fetch('https://fdnd.directus.app/items/squad?filter={"_and":[{"cohort":"2425"},{"tribe":{"name":"FDND Jaar 1"}}]}')
const squadResponseJSON = await squadResponse.json()

app.get('/', async function (request, response) {
  // Haal berichten op voor het team
  const messagesResponse = await fetch(`https://fdnd.directus.app/items/messages/?filter={"for":"Team ${teamName}"}`);
  const messagesResponseJSON = await messagesResponse.json();
  

 // render de homepage met de opgehaalde data
  response.render('index.liquid', {
    teamName: teamName,
    persons: personResponseJSON.data,
    squads: squadResponseJSON.data,
    messages: messagesResponseJSON.data,
    likes: likes // -- likes object wordt meegegeven aan de template om de like status per persoon te tonen
  });
});

//route aanmaken voor studentpagina
app.get('/student/:id', async function (request, response) {
  const personDetailResponse = await fetch(`https://fdnd.directus.app/items/person/${request.params.id}`);
  const personDetailResponseJSON = await personDetailResponse.json();
  
  // Haal berichten op die specifiek voor deze student bedoeld zijn
  const messagesResponse = await fetch(`https://fdnd.directus.app/items/messages/?filter={"for":"${request.params.id}"}`);
  const messagesResponseJSON = await messagesResponse.json();

  response.render('student.liquid', {
    person: personDetailResponseJSON.data,
    squads: squadResponseJSON.data,
    messages: messagesResponseJSON.data // Stuur alleen berichten voor deze student
  });
});


//posten voor op de studentenpagina
app.post('/student/:id', async function (request, response) {
  await fetch('https://fdnd.directus.app/items/messages/', {
    method: 'POST',
    body: JSON.stringify({
      for: request.params.id, 
      text: request.body.message
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });

  response.redirect(303, `/student/${request.params.id}`);
});


app.get('/login', async function (request, response) {
  if (logged) return response.redirect(303, "/");

  response.render('login.liquid');
});

app.post('/login', async function (request, response) {
  // Haal de input op van de login pagina
  const inputName = request.body.naam;
  
  if (!inputName) {
    return response.render('login.liquid', { 
      error: 'Voer een naam in'
    });
  }
  
  // Zet de input om naar lowercase en verwijder spaties
  const normalizedInput = inputName.toLowerCase().replace(/\s+/g, '');
  
  // Match de input met een van de personen in de processedPeople array
  const validUser = processedPeople.find(person => {
    const validLogin = `${person.first_name?.toLowerCase()}${person.processedName}`;
    return validLogin === normalizedInput;
  });
  
  if (validUser) {
    // Als de input overeenkomt met een van de personen in de processedPeople array, maak een cookie aan met hun naam
    // en behoud deze cookie voor 1 jaar
    response.cookie('logged', normalizedInput, { maxAge: 34560000, httpOnly: true });
    
    // Log de ingelogde gebruiker in de team database
    await fetch('https://fdnd.directus.app/items/messages/', {
      method: 'POST',
      body: JSON.stringify({
        for: `Team ${teamName}`,
        from: 'Systeem',
        text: `${normalizedInput} is ingelogd!`
      }),
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });
    
    return response.redirect(303, '/');
  } else {
    // Als de input niet overeenkomt met een van de personen in de processedPeople array, geef een error
    return response.render('login.liquid', { 
      error: 'Ongeldige login. Probeer opnieuw.'
    });
  }
});

app.get('/logger', async function (request, response) {
  // Haal berichten op voor het team
  const messagesResponse = await fetch(`https://fdnd.directus.app/items/messages/?filter={"for":"Team ${teamName}"}`);
  const messagesResponseJSON = await messagesResponse.json();

  response.render('logger.liquid', {
    teamName: teamName,
    squads: squadResponseJSON.data,
    messages: messagesResponseJSON.data
  });
})

app.post('/logger', async function (request, response) {
  await fetch('https://fdnd.directus.app/items/messages/', {
    method: 'POST',
    body: JSON.stringify({
      for: request.params.id, 
      text: request.body.message
    }),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  });
  
  response.redirect('/')
})

// Add logout route
app.get('/logout', (request, response) => {
  // Clear de cookie
  response.clearCookie('logged');
  // Reset logged
  logged = null;
  // Redirect naar de login pagina
  response.redirect('/login');
});
// -- POST route: 
// hier wordt eerst gekeken of er al een like status is voor de persoon. Zo niet, dan wordt deze op 0 gezet.
// dan wordt de like status met 1 verhoogd met ++, en wordt de nieuwe status opgeslagen in het likes object.
// vervolgens wordt de nieuwe like status geprint in de console.
// tot slot wordt de gebruiker geredirect naar de homepage.
app.post('/like', function (request, response) {
   const personId = request.body.person_id;
  if (!likes[personId]) {
    likes[personId] = 0;  
   }
 likes[personId]++;
   console.log(`Persoon ${personId} heeft nu ${likes[personId]} likes`);  
  response.redirect(303, '/');
 });

app.set('port', process.env.PORT || 8000)

if (teamName == '') {
  console.log('Voeg eerst de naam van jullie team in de code toe.')
} else {
  app.listen(app.get('port'), function () {
    console.log(`Application started on http://localhost:${app.get('port')}`)
  })
}


