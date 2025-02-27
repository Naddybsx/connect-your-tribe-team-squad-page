## Squadpage team Hype 
Welkom op de squadpage van team Hype. Een dynamische website waarbij je squadleden kunt bekijken, likes kunt geven en berichten kunt achterlaten. Onze website biedt een overzicht van iedereen in de squad, compleet met een profielkaart en de mogelijkheid om interactie aan te gaan.

[Bekijk onze squadpage!](https://connect-your-tribe-team-squad-page-72f1.onrender.com/)

## Beschrijving
`Inloggen is simpel:` vul je voornaam en de eerste twee letters vanje achternaam in. Eenmaal ingelogd kom je op de overzichtspagina, waar je alle squadleden ziet. Je kunt een like achterlaten als je iemand wilt waarderen en berichten plaatsen op hun profielpagina. Alles wordt netjes opgeslagen, zodat je kunt zien wie de meeste likes heeft en wat er wordt gezegd!

### Teamleden & bijdragen
- [Amber](https://github.com/ambersr)


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

- [Colin](https://github.com/ColindeGroot)
- [Marcin](https://github.com/MarsGotBars)
- [Nadira](https://github.com/Naddybsx)

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

