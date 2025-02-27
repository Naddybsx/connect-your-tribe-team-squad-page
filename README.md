## Squadpage team Hype 
Welkom op de squadpage van team Hype. Een dynamische website waarbij je squadleden kunt bekijken, likes kunt geven en berichten kunt achterlaten. Onze website biedt een overzicht van iedereen in de squad, compleet met een profielkaart en de mogelijkheid om interactie aan te gaan.

[Bekijk onze squadpage!](https://connect-your-tribe-team-squad-page-72f1.onrender.com/)


## Beschrijving
`Inloggen is simpel:` vul je voornaam en de eerste twee letters vanje achternaam in. Eenmaal ingelogd kom je op de overzichtspagina, waar je alle squadleden ziet. Je kunt een like achterlaten als je iemand wilt waarderen en berichten plaatsen op hun profielpagina. Alles wordt netjes opgeslagen, zodat je kunt zien wie de meeste likes heeft en wat er wordt gezegd!

### Teamleden & bijdragen
- Amber
- Colin
- Marcin
- Nadira

## Kenmerken
`Onze squadpage is gebouwd met de volgende technieken:` Klik op de linkjes om meer te leren over wat deze technieken inhouden en hoe je het kunt gebruiken :)
- [`Node.js`](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) & [`Express`](https://www.geeksforgeeks.org/express-js/): De basis van onze server en routing.
- [`LiquidJS`](https://liquidjs.com/tutorials/intro-to-liquid.html): Voor het dynmisch renderen van HTML.
- [`Directus API`](https://docs.directus.io/getting-started/quickstart.html): opslag en ophalen van squadleden, berichten en likes.
- [`Cookie parser`](https://www.geeksforgeeks.org/express-cookie-parser-signed-and-unsigned-cookies/): Houdt bij wie ingelogd is en welke likes een gebruiker heeft gegeven.

### Hoe werkt de server?
Onze server draait op `Node.js` en `Express` en verwerkt alle inkomende `HTTP verzoeken`. 

Hier is een overzicht van hoe dit werkt:
1. `Data ophalen`: De server haalt gegevens op via `fetch()` aanvragen aan de `Directus API`. Dit gebeurt voor squadleden, berichten en likes.
2. `Data verwerken`: We koppelen de opgehaalde data aan de juiste personen, berekenen likes per persoon en filterengegevens.
3. `HTML genereren`: Met `LiquidJS` geven we de opgehaalde data door aan onze templates, zodat de pagina's dynamisch gegenereerd worden met de juiste inhoud.
4. `State beheren`: Met `cookies` slaan we inloggegevens en voorkeuren van gebruikers op.

### Routes en dataverwerking
- [app.get("/")](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/blob/39d4fbd10823e3a7563c20540a1ca2c9a7795e44/server.js#L88-L128) : Laadt de squadpage met alle personen, likes en filterfunctionaiteit. Data wordt opgehaald via; https:fdnd.directus.app/items/person/
- [app.get("/login)](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/blob/39d4fbd10823e3a7563c20540a1ca2c9a7795e44/server.js#L176-L180) : Laadt de inlogpagina
- [app.post("/login")](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/blob/39d4fbd10823e3a7563c20540a1ca2c9a7795e44/server.js#L182-L229) : Verwerkt de inloggegevens en slaat de gebruiker op in een cookie. De login wordt gevalideerd aan de hand van processedPeople.
- [app.get("/student/:id")](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/blob/39d4fbd10823e3a7563c20540a1ca2c9a7795e44/server.js#L131-L154) : Laadt de detailpagina van een persoon, incl hun profiel en berichten. Berichten worden gesorteerd op datum, waarbij het nieuwste bericht bovenaan staat.
- [app.post("/student:id")](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/blob/39d4fbd10823e3a7563c20540a1ca2c9a7795e44/server.js#L157-L172) : Voegt een bericht toe aan een persoon en slaat deze op.
- [app.post:("/like")](https://github.com/Naddybsx/connect-your-tribe-team-squad-page/blob/39d4fbd10823e3a7563c20540a1ca2c9a7795e44/server.js#L275-L321) : Voegt een like toe of verwijdert deze als de gebruiker al heeft geliket. Een gebruiker kan slechts één like per persoon toevoegen of verwijderen.

## Installatie

