import { Task } from "../constants/appConfig";
import { taskService } from "../services/taskService";

// Fallback tasks for offline use
const fallbackTasks: Omit<Task, "id" | "completed" | "calculatedDate">[] = [
  {
    text: "Maak je verloving bekend",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/verloving-bekend-maken/",
  },
  {
    text: "Kies een bruiloft thema",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/persoonlijk-bruiloft-thema-kiezen/",
  },
  {
    text: "Praat met je partner en familie over financien van de bruiloft",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
  },
  {
    text: "Onderzoek wat een bruiloft precies kost",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/wat-kost-een-bruiloft-realistisch-overzicht/",
  },
  {
    text: "Maak je bruiloft begroting",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
  },
  {
    text: "Bepaal of je een weddingplanner wilt inhuren",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/weddingplanner-kosten-taken/",
  },
  {
    text: "Bepaal de kleuren voor jullie bruiloft",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
  },
  {
    text: "Denk na over welke bruiloft tradities je wel of niet wilt gebruiken",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/je-eigen-trouwtradities-maken/",
  },
  {
    text: "Organiseer een verlovingsfeestje",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
  },
  {
    text: "Denk na over de trouwlocatie en het seizoen waarin je wilt trouwen",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
  },
  {
    text: "Trouwen in het buitenland? Maak die keuze nu!",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/trouwen-in-buitenland/",
  },
  {
    text: "Begin met jullie gastenlijst",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/gastenlijst-maken-voor-je-bruiloft-dat-doe-je-zo/",
  },
  {
    text: "Begin met de zoektocht naar jullie trouwlocatie",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=originele-trouwlocaties&mpfavs_region=0",
  },
  {
    text: "Houd je begroting bij, gaat alles nog volgens plan?",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
  },
  {
    text: "Hebben jullie een trouwambtenaar nodig?",
    relativeDueDate: {
      value: 370,
      unit: "days",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=ceremoniesprekers-en-trouwambtenaren-babs&mpfavs_region=0",
  },
  {
    text: "Maak een selectie met favoriete trouwlocaties",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=originele-trouwlocaties&mpfavs_region=0",
  },
  {
    text: "Maak een inschatting van het aantal gasten dat je wilt uitnodigen",
    relativeDueDate: {
      value: 349,
      unit: "days",
    },
  },
  {
    text: "Waar gaat jullie trouwceremonie plaatsvinden? Is er genoeg plek?",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
  },
  {
    text: "Plan locatie-bezoeken in",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
  },
  {
    text: "Boek de locatie voor jullie receptie",
    relativeDueDate: {
      value: 0,
      unit: "percentage",
    },
  },
  {
    text: "Maak een bruiloft app voor gasten",
    relativeDueDate: {
      value: 5,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/app-voor-bruiloftsgasten-persoonlijk/",
  },
  {
    text: "Ontdek welke stijl stationery bij jullie past",
    relativeDueDate: {
      value: 5,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bruiloft-stationery-en-trouwkaarten&mpfavs_region=0",
  },
  {
    text: "Bepaal welke stijl trouwjurk je zou willen",
    relativeDueDate: {
      value: 5,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/trouwjurken/",
  },
  {
    text: "Bestel save-the-date proefdrukken",
    relativeDueDate: {
      value: 310,
      unit: "days",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bruiloft-stationery-en-trouwkaarten&mpfavs_region=0",
  },
  {
    text: "Onderzoek welke fotografie stijl jullie graag willen",
    relativeDueDate: {
      value: 5,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=trouwfotograaf&mpfavs_region=0",
  },
  {
    text: "Boek een hotel voor jullie huwelijksnacht",
    relativeDueDate: {
      value: 10,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/huwelijksreis-inspiratie/huwelijksnacht/",
  },
  {
    text: "Maak een lijstje met favoriete cateraars",
    relativeDueDate: {
      value: 10,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=catering&mpfavs_region=0",
  },
  {
    text: "Vraag je getuigen en eventueel maid of honour & best man.",
    relativeDueDate: {
      value: 10,
      unit: "percentage",
    },
  },
  {
    text: "Maak afspraken met jullie favoriete fotografen",
    relativeDueDate: {
      value: 10,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=trouwfotograaf&mpfavs_region=0",
  },
  {
    text: "Maak afspraken met cateraars",
    relativeDueDate: {
      value: 10,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=catering&mpfavs_region=0",
  },
  {
    text: "Maak de gastenlijst af",
    relativeDueDate: {
      value: 10,
      unit: "percentage",
    },
  },
  {
    text: "Bestel save-the-dates",
    relativeDueDate: {
      value: 280,
      unit: "days",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bruiloft-stationery-en-trouwkaarten&mpfavs_region=0",
  },
  {
    text: "Plan pas-afspraken in voor een trouwpak",
    relativeDueDate: {
      value: 10,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bruidegom-trouwpak&mpfavs_region=0",
  },
  {
    text: "Plan pas-afspraken in voor een trouwjurk",
    relativeDueDate: {
      value: 10,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=trouwjurk&mpfavs_region=0",
  },
  {
    text: "Boek je trouwfotograaf",
    relativeDueDate: {
      value: 10,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=trouwfotograaf&mpfavs_region=0",
  },
  {
    text: "Boek je cateraar",
    relativeDueDate: {
      value: 10,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=catering&mpfavs_region=0",
  },
  {
    text: "Schedule engagement photos",
    relativeDueDate: {
      value: 10,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=trouwfotograaf&mpfavs_region=0",
  },
  {
    text: "Bestel proefdrukken van jullie trouwkaarten",
    relativeDueDate: {
      value: 267,
      unit: "days",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bruiloft-stationery-en-trouwkaarten&mpfavs_region=0",
  },
  {
    text: "Stuur jullie save-the-dates",
    relativeDueDate: {
      value: 245,
      unit: "days",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bruiloft-stationery-en-trouwkaarten&mpfavs_region=0",
  },
  {
    text: "Welke bloemen willen jullie op de bruiloft?",
    relativeDueDate: {
      value: 15,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bloemen-bruidsboeket&mpfavs_region=0",
  },
  {
    text: "Koop je trouwjurk",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=trouwjurk&mpfavs_region=0",
  },
  {
    text: "Koop je trouwpak",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bruidegom-trouwpak&mpfavs_region=0",
  },
  {
    text: "Verzamel foto's van bruidstaarten in een Pinterest-bord",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bruidstaart&mpfavs_region=0",
  },
  {
    text: "DJ of band? Of allebei?",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/band-of-dj-op-jullie-bruiloft/",
  },
  {
    text: "Maak afspraken met bloemisten",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bloemen-bruidsboeket&mpfavs_region=0",
  },
  {
    text: "Verzamel foto's van bloemen in een Pinterest-bord",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bloemen-bruidsboeket&mpfavs_region=0",
  },
  {
    text: "Ga op zoek naar een patissier",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bruidstaart&mpfavs_region=0",
  },
  {
    text: "Ga op zoek naar een trouwambtenaar",
    relativeDueDate: {
      value: 224,
      unit: "days",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=ceremoniesprekers-en-trouwambtenaren-babs&mpfavs_region=0",
  },
  {
    text: "Maak afspraken met DJ's, bands en/of andere muzikanten",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=djs-bands-bruiloft-muziek&mpfavs_region=0",
  },
  {
    text: "Boek je bloemist",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bloemen-bruidsboeket&mpfavs_region=0",
  },
  {
    text: "Wat voor boeket willen jullie?",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bloemen-bruidsboeket&mpfavs_region=0",
  },
  {
    text: "Willen jullie corsages?",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bloemen-bruidsboeket&mpfavs_region=0",
  },
  {
    text: "Ga op onderzoek uit naar een videograaf!",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=trouwvideograaf&mpfavs_region=0",
  },
  {
    text: "Maak afspraken met patissiers",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bruidstaart&mpfavs_region=0",
  },
  {
    text: "Gaan jullie een rehearsal dinner plannen?",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/rehearsal-dinner-iets-voor-jullie/",
  },
  {
    text: "Boek je band en/of DJ",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=djs-bands-bruiloft-muziek&mpfavs_region=0",
  },
  {
    text: "Maak afspraken met trouwambtenaren",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=ceremoniesprekers-en-trouwambtenaren-babs&mpfavs_region=0",
  },
  {
    text: "Maak afspraken met videografen",
    relativeDueDate: {
      value: 20,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=trouwvideograaf&mpfavs_region=0",
  },
  {
    text: "Maak een lijst met jullie droombestemmingen voor een huwelijksreis",
    relativeDueDate: {
      value: 30,
      unit: "percentage",
    },
  },
  {
    text: "Book jullie patissier",
    relativeDueDate: {
      value: 30,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bruidstaart&mpfavs_region=0",
  },
  {
    text: "Boek je videograaf",
    relativeDueDate: {
      value: 30,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=trouwvideograaf&mpfavs_region=0",
  },
  {
    text: "Willen jullie nog iets met de bruiloftgasten doen na de bruiloft?",
    relativeDueDate: {
      value: 196,
      unit: "days",
    },
  },
  {
    text: "Waar willen jullie je rehearsal dinner doen?",
    relativeDueDate: {
      value: 30,
      unit: "percentage",
    },
  },
  {
    text: "Willen jullie een photobooth?",
    relativeDueDate: {
      value: 40,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=photobooth-bruiloft&mpfavs_region=0",
  },
  {
    text: "Boek de locatie voor jullie rehearsal dinner",
    relativeDueDate: {
      value: 40,
      unit: "percentage",
    },
  },
  {
    text: "Verzamel inspiratie foto's voor haar en make-up",
    relativeDueDate: {
      value: 154,
      unit: "days",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=haar-make-up-bruiloft-bruidsvisagie-bruidskapsel&mpfavs_region=0",
  },
  {
    text: "Gaan jullie iets veranderen aan je achternaam?",
    relativeDueDate: {
      value: 40,
      unit: "percentage",
    },
  },
  {
    text: "Bestel styling en verhuur",
    relativeDueDate: {
      value: 40,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bruiloftstyling-verhuur&mpfavs_region=0",
  },
  {
    text: "Boek een huwelijksreis",
    relativeDueDate: {
      value: 50,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/huwelijksreis/",
  },
  {
    text: "Maak afspraken met haar en make-up artists",
    relativeDueDate: {
      value: 140,
      unit: "days",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=haar-make-up-bruiloft-bruidsvisagie-bruidskapsel&mpfavs_region=0",
  },
  {
    text: "Boek jullie trouwambtenaar",
    relativeDueDate: {
      value: 140,
      unit: "days",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=ceremoniesprekers-en-trouwambtenaren-babs&mpfavs_region=0",
  },
  {
    text: "Verzamel foto's van trouwringen die jullie mooi vinden",
    relativeDueDate: {
      value: 50,
      unit: "percentage",
    },
  },
  {
    text: "Shop trouwringen",
    relativeDueDate: {
      value: 50,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=trouwringen-sieraden&mpfavs_region=0",
  },
  {
    text: "Bestel jullie trouwkaarten",
    relativeDueDate: {
      value: 115,
      unit: "days",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=bruiloft-stationery-en-trouwkaarten&mpfavs_region=0",
  },
  {
    text: "Bestel jullie trouwringen",
    relativeDueDate: {
      value: 60,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=trouwringen-sieraden&mpfavs_region=0",
  },
  {
    text: "Bestel postzegels voor jullie trouwkaarten",
    relativeDueDate: {
      value: 98,
      unit: "days",
    },
  },
  {
    text: "Zet adressen op de enveloppen voor de trouwkaarten",
    relativeDueDate: {
      value: 84,
      unit: "days",
    },
  },
  {
    text: "Verstuur jullie trouwkaarten",
    relativeDueDate: {
      value: 80,
      unit: "days",
    },
  },
  {
    text: "Bevestig de bestelling bij de cateraar",
    relativeDueDate: {
      value: 70,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=catering&mpfavs_region=0",
  },
  {
    text: "Boek een bartender als dit niet is inbegrepen bij de trouwlocatie",
    relativeDueDate: {
      value: 70,
      unit: "percentage",
    },
  },
  {
    text: "Bepaal wat jullie willen dragen tijdens het rehearsal dinner",
    relativeDueDate: {
      value: 80,
      unit: "percentage",
    },
  },
  {
    text: "Huwelijk aanmelden bij de gemeente",
    relativeDueDate: {
      value: 51,
      unit: "days",
    },
  },
  {
    text: "Kies een app waarmee je bruiloftfoto's van gasten kunt verzamelen",
    relativeDueDate: {
      value: 80,
      unit: "percentage",
    },
    link: "https://app.girlsofhonour.nl/",
  },
  {
    text: "Begin aan jullie trouwgeloften",
    relativeDueDate: {
      value: 80,
      unit: "percentage",
    },
    link: "https://www.girlsofhonour.nl/trouwgeloftes-schrijven/",
  },
  {
    text: "Maak een tafelsetting",
    relativeDueDate: {
      value: 36,
      unit: "days",
    },
  },
  {
    text: "Stuur een herinnering aan mensen voor de RSVP",
    relativeDueDate: {
      value: 35,
      unit: "days",
    },
  },
  {
    text: "Laatste passessies voor trouwjurk en trouwpak",
    relativeDueDate: {
      value: 30,
      unit: "days",
    },
  },
  {
    text: "Proefsessies voor haar en make-up",
    relativeDueDate: {
      value: 30,
      unit: "days",
    },
    link: "https://www.girlsofhonour.nl/lievelingsleveranciers/?mpfavs_cat=haar-make-up-bruiloft-bruidsvisagie-bruidskapsel&mpfavs_region=0",
  },
  {
    text: "Doen jullie een openingsdans? Plan in om die te oefenen!",
    relativeDueDate: {
      value: 85,
      unit: "percentage",
    },
  },
  {
    text: "Maak jullie trouwgeloften af",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Koop of maak een EHBO-kit voor de trouwdag",
    relativeDueDate: {
      value: 21,
      unit: "days",
    },
  },
  {
    text: "Kies menukaarten, tafelnummers, etc.",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Haal de trouwjurk en het trouwpak op",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Pak een koffer in voor de huwelijksreis",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Bereid je toast voor",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Maak een lijst met bruiloft-liedjes",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Bevestig details en betalingen met jullie leveranciers",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Bevesteg details en dagschema met de bruiloftsgasten",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Maak de tafelsetting af",
    relativeDueDate: {
      value: 7,
      unit: "days",
    },
  },
  {
    text: "Schrijf een lief briefje voor je partner",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Ruim je huis op (tenzij je daar niet gaat klaarmaken voor de bruiloft ;))",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Breng decoratie naar de trouwlocatie als dit nodig is",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Probeer je te ontspannen!",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Woohoo! Het is jullie trouwdag!",
    relativeDueDate: {
      value: 0,
      unit: "days",
    },
  },
  {
    text: "Neem een stuk bruidstaart mee wat over is",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Verzamel de cadeaus (of laat die doen)",
    relativeDueDate: {
      value: 90,
      unit: "percentage",
    },
  },
  {
    text: "Breng gehuurde items terug",
    relativeDueDate: {
      value: -2,
      unit: "days",
    },
  },
  {
    text: "Laat het bruidsboeket prepareren",
    relativeDueDate: {
      value: -4,
      unit: "days",
    },
  },
  {
    text: "Laat de trouwjurk en het trouwpak reinigen",
    relativeDueDate: {
      value: -4,
      unit: "days",
    },
  },
  {
    text: "Geef jullie favoriete leveranciers een review op Google",
    relativeDueDate: {
      value: -13,
      unit: "days",
    },
  },
  {
    text: "Update jullie verzekeringen",
    relativeDueDate: {
      value: -41,
      unit: "days",
    },
  },
  {
    text: "Regel het papierwerk voor het veranderen van jullie naam",
    relativeDueDate: {
      value: -41,
      unit: "days",
    },
  },
  {
    text: "Bestel trouwfoto's en een album",
    relativeDueDate: {
      value: -55,
      unit: "days",
    },
  },
  {
    text: "Deel jullie foto's en video!",
    relativeDueDate: {
      value: -60,
      unit: "days",
    },
  },
];

// Function to get default tasks from cloud or fallback
export const getDefaultTasks = async (): Promise<
  Omit<Task, "id" | "completed" | "calculatedDate">[]
> => {
  try {
    const cloudTasks = await taskService.getDefaultTasks();
    return cloudTasks;
  } catch (error) {
    console.error("Error loading tasks from cloud, using fallback:", error);
    return fallbackTasks;
  }
};

// Keep the old export for backward compatibility
export const defaultTasks = fallbackTasks;
