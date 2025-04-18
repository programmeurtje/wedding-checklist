import { Task } from '../constants/appConfig';

export const defaultTasks: Omit<Task, 'id' | 'completed' | 'calculatedDate'>[] = [
  {
    text: "Maak je verloving bekend",
    relativeDueDate: { value: 391, unit: 'days' },
  },
  {
    text: "Kies een bruiloft thema",
    relativeDueDate: { value: 391, unit: 'days' },
    link: "https://www.girlsofhonor.com/"
  },
  {
    text: "Praat met je partner en familie over financien van de bruiloft",
    relativeDueDate: { value: 388, unit: 'days' },
    
  },
  {
    text: "Onderzoek wat een bruiloft precies kost",
    relativeDueDate: { value: 388, unit: 'days' },
    
    link: "https://www.girlsofhonor.com/"
  },
  {
    text: "Maak je bruiloft begroting",
    relativeDueDate: { value: 384, unit: 'days' },
    
    link: "https://www.girlsofhonor.com/"
  },
  {
    text: "Bepaal of je een weddingplanner wilt inhuren",
    relativeDueDate: { value: 382, unit: 'days' },
    
    link: "https://www.girlsofhonor.com/"
  },
  {
    text: "Bepaal de kleuren voor jullie bruiloft",
    relativeDueDate: { value: 382, unit: 'days' },
    
  },
  {
    text: "Denk na over welke bruiloft tradities je wel of niet wilt gebruiken",
    relativeDueDate: { value: 382, unit: 'days' },
    
  },
  {
    text: "Organiseer een verlovingsfeestje",
    relativeDueDate: { value: 377, unit: 'days' },
    
  },
  {
    text: "Denk na over de trouwlocatie en het seizoen waarin je wilt trouwen",
    relativeDueDate: { value: 377, unit: 'days' },
    
  },
  {
    text: "Trouwen in het buitenland? Maak die keuze nu!",
    relativeDueDate: { value: 377, unit: 'days' },
    
  },
  {
    text: "Begin met jullie gastenlijst",
    relativeDueDate: { value: 377, unit: 'days' },
    
  },
  {
    text: "Begin met de zoektocht naar jullie trouwlocatie",
    relativeDueDate: { value: 377, unit: 'days' },
    
  },
  {
    text: "Houd je begroting bij, gaat alles nog volgens plan?",
    relativeDueDate: { value: 370, unit: 'days' },
    
  },
  {
    text: "Hebben jullie een trouwambtenaar nodig?",
    relativeDueDate: { value: 370, unit: 'days' },
    
  },
  {
    text: "Maak een selectie met favoriete trouwlocaties",
    relativeDueDate: { value: 349, unit: 'days' },
    
  },
  {
    text: "Maak een inschatting van het aantal gasten dat je wilt uitnodigen",
    relativeDueDate: { value: 349, unit: 'days' },
    
  },
  {
    text: "Waar gaat jullie trouwceremonie plaatsvinden? Is er genoeg plek?",
    relativeDueDate: { value: 342, unit: 'days' },
    
  },
  {
    text: "Plan locatie-bezoeken in",
    relativeDueDate: { value: 342, unit: 'days' },
    
  },
  {
    text: "Boek de locatie voor jullie receptie",
    relativeDueDate: { value: 335, unit: 'days' },
    
  },
  {
    text: "Maak een bruiloft app voor gasten",
    relativeDueDate: { value: 328, unit: 'days' },
    
  },
  {
    text: "Ontdek welke stijl stationery bij jullie past",
    relativeDueDate: { value: 323, unit: 'days' },
    
  },
  {
    text: "Bepaal welke stijl trouwjurk je zou willen",
    relativeDueDate: { value: 323, unit: 'days' },
    
  },
  {
    text: "Bestel save-the-date proefdrukken",
    relativeDueDate: { value: 310, unit: 'days' },
    
  },
  {
    text: "Onderzoek welke fotografie stijl jullie graag willen",
    relativeDueDate: { value: 300, unit: 'days' },
    
  },
  {
    text: "Boek een hotel voor jullie huwelijksnacht",
    relativeDueDate: { value: 299, unit: 'days' },
    
  },
  {
    text: "Maak een lijstje met favoriete cateraars",
    relativeDueDate: { value: 293, unit: 'days' },
    
  },
  {
    text: "Vraag je getuigen en eventueel maid of honour & best man.",
    relativeDueDate: { value: 293, unit: 'days' },
    
  },
  {
    text: "Maak afspraken met jullie favoriete fotografen",
    relativeDueDate: { value: 293, unit: 'days' },
    
  },
  {
    text: "Maak afspraken met cateraars",
    relativeDueDate: { value: 286, unit: 'days' },
    
  },
  {
    text: "Maak de gastenlijst af",
    relativeDueDate: { value: 286, unit: 'days' },
    
  },
  {
    text: "Bestel save-the-dates",
    relativeDueDate: { value: 280, unit: 'days' },
    
  },
  {
    text: "Plan pas-afspraken in voor een trouwpak",
    relativeDueDate: { value: 280, unit: 'days' },
    
  },
  {
    text: "Plan pas-afspraken in voor een trouwjurk",
    relativeDueDate: { value: 280, unit: 'days' },
    
  },
  {
    text: "Boek je trouwfotograaf",
    relativeDueDate: { value: 279, unit: 'days' },
    
  },
  {
    text: "Boek je cateraar",
    relativeDueDate: { value: 272, unit: 'days' },
    
  },
  {
    text: "Schedule engagement photos", // Assuming this should remain English?
    relativeDueDate: { value: 271, unit: 'days' },
    
  },
  {
    text: "Bestel proefdrukken van jullie trouwkaarten",
    relativeDueDate: { value: 267, unit: 'days' },
    
  },
  {
    text: "Stuur jullie save-the-dates",
    relativeDueDate: { value: 245, unit: 'days' },
    
  },
  {
    text: "Welke bloemen willen jullie op de bruiloft? ", // Trailing space kept from input
    relativeDueDate: { value: 245, unit: 'days' },
    
  },
  {
    text: "Koop je trouwjurk",
    relativeDueDate: { value: 238, unit: 'days' },
    
  },
  {
    text: "Koop je trouwpak",
    relativeDueDate: { value: 238, unit: 'days' },
    
  },
  {
    text: "Verzamel foto's van bruidstaarten in een Pinterest-bord",
    relativeDueDate: { value: 235, unit: 'days' },
    
  },
  {
    text: "DJ of band? Of allebei?",
    relativeDueDate: { value: 231, unit: 'days' },
    
  },
  {
    text: "Maak afspraken met bloemisten",
    relativeDueDate: { value: 231, unit: 'days' },
    
  },
  {
    text: "Verzamel foto's van bloemen in een Pinterest-bord",
    relativeDueDate: { value: 228, unit: 'days' },
    
  },
  {
    text: "Ga op zoek naar een patissier",
    relativeDueDate: { value: 224, unit: 'days' },
    
  },
  {
    text: "Ga op zoek naar een trouwambtenaar",
    relativeDueDate: { value: 224, unit: 'days' },
    
  },
  {
    text: "Maak afspraken met DJ's, bands en/of andere muzikanten",
    relativeDueDate: { value: 224, unit: 'days' },
    
  },
  {
    text: "Boek je bloemist",
    relativeDueDate: { value: 217, unit: 'days' },
    
  },
  {
    text: "Wat voor boeket willen jullie?",
    relativeDueDate: { value: 215, unit: 'days' },
    
  },
  {
    text: "Willen jullie corsages?",
    relativeDueDate: { value: 214, unit: 'days' },
    
  },
  {
    text: "Ga op onderzoek uit naar een videograaf!",
    relativeDueDate: { value: 214, unit: 'days' },
    
  },
  {
    text: "Maak afspraken met patissiers",
    relativeDueDate: { value: 213, unit: 'days' },
    
  },
  {
    text: "Gaan jullie een rehearsal dinner plannen?",
    relativeDueDate: { value: 213, unit: 'days' },
    
  },
  {
    text: "Boek je band en/of DJ",
    relativeDueDate: { value: 210, unit: 'days' },
    
  },
  {
    text: "Maak afspraken met trouwambtenaren",
    relativeDueDate: { value: 210, unit: 'days' },
    
  },
  {
    text: "Maak afspraken met videografen",
    relativeDueDate: { value: 210, unit: 'days' },
    
  },
  {
    text: "Maak een lijst met jullie droombestemmingen voor een huwelijksreis",
    relativeDueDate: { value: 203, unit: 'days' },
    
  },
  {
    text: "Book jullie patissier", // Typo "Book" kept from input
    relativeDueDate: { value: 203, unit: 'days' },
    
  },
  {
    text: "Boek je videograaf",
    relativeDueDate: { value: 196, unit: 'days' },
    
  },
  {
    text: "Willen jullie nog iets met de bruiloftgasten doen na de bruiloft?",
    relativeDueDate: { value: 196, unit: 'days' },
    
  },
  {
    text: "Waar willen jullie je rehearsal dinner doen?",
    relativeDueDate: { value: 182, unit: 'days' },
    
  },
  {
    text: "Willen jullie een photobooth?",
    relativeDueDate: { value: 175, unit: 'days' },
    
  },
  {
    text: "Boek de locatie voor jullie rehearsal dinner",
    relativeDueDate: { value: 161, unit: 'days' },
    
  },
  {
    text: "Verzamel inspiratie foto's voor haar en make-up",
    relativeDueDate: { value: 154, unit: 'days' },
    
  },
  {
    text: "Gaan jullie iets veranderen aan je achternaam?",
    relativeDueDate: { value: 154, unit: 'days' },
    
  },
  {
    text: "Bestel styling en verhuur",
    relativeDueDate: { value: 152, unit: 'days' },
    
  },
  {
    text: "Boek een huwelijksreis",
    relativeDueDate: { value: 147, unit: 'days' },
    
  },
  {
    text: "Maak afspraken met haar en make-up artists",
    relativeDueDate: { value: 140, unit: 'days' },
    
  },
  {
    text: "Boek jullie trouwambtenaar",
    relativeDueDate: { value: 140, unit: 'days' },
    
  },
  {
    text: "Verzamel foto's van trouwringen die jullie mooi vinden",
    relativeDueDate: { value: 129, unit: 'days' },
    
  },
  {
    text: "Shop trouwringen",
    relativeDueDate: { value: 123, unit: 'days' },
    
  },
  {
    text: "Bestel jullie trouwkaarten",
    relativeDueDate: { value: 115, unit: 'days' },
    
  },
  {
    text: "Bestel jullie trouwringen",
    relativeDueDate: { value: 102, unit: 'days' },
    
  },
  {
    text: "Bestel postzegels voor jullie trouwkaarten",
    relativeDueDate: { value: 98, unit: 'days' },
    
  },
  {
    text: "Zet adressen op de enveloppen voor de trouwkaarten",
    relativeDueDate: { value: 84, unit: 'days' },
    
  },
  {
    text: "Verstuur jullie trouwkaarten",
    relativeDueDate: { value: 80, unit: 'days' },
    
  },
  {
    text: "Bevestig de bestelling bij de cateraar",
    relativeDueDate: { value: 60, unit: 'days' },
    
  },
  {
    text: "Boek een bartender als dit niet is inbegrepen bij de trouwlocatie",
    relativeDueDate: { value: 60, unit: 'days' },
    
  },
  {
    text: "Bepaal wat jullie willen dragen tijdens het rehearsal dinner",
    relativeDueDate: { value: 56, unit: 'days' },
    
  },
  {
    text: "Huwelijk aanmelden bij de gemeente",
    relativeDueDate: { value: 51, unit: 'days' },
    
  },
  {
    text: "Kies een app waarmee je bruiloftfoto's van gasten kunt verzamelen",
    relativeDueDate: { value: 49, unit: 'days' },
    
  },
  {
    text: "Begin aan jullie trouwgeloften",
    relativeDueDate: { value: 49, unit: 'days' },
    
  },
  {
    text: "Maak een tafelsetting",
    relativeDueDate: { value: 36, unit: 'days' },
    
  },
  {
    text: "Stuur een herinnering aan mensen voor de RSVP",
    relativeDueDate: { value: 35, unit: 'days' },
    
  },
  {
    text: "Laatste passessies voor trouwjurk en trouwpak",
    relativeDueDate: { value: 30, unit: 'days' },
     // Should maybe be "1 month"? Kept from input.
  },
  {
    text: "Proefsessies voor haar en make-up",
    relativeDueDate: { value: 30, unit: 'days' },
    
  },
  {
    text: "Doen jullie een openingsdans? Plan in om die te oefenen!",
    relativeDueDate: { value: 30, unit: 'days' },
    
  },
  {
    text: "Maak jullie trouwgeloften af",
    relativeDueDate: { value: 21, unit: 'days' },
    
  },
  {
    text: "Koop of maak een EHBO-kit voor de trouwdag",
    relativeDueDate: { value: 21, unit: 'days' },
    
  },
  {
    text: "Kies menukaarten, tafelnummers, etc.",
    relativeDueDate: { value: 21, unit: 'days' },
    
  },
  {
    text: "Haal de trouwjurk en het trouwpak op",
    relativeDueDate: { value: 21, unit: 'days' },
    
  },
  {
    text: "Pak een koffer in voor de huwelijksreis",
    relativeDueDate: { value: 14, unit: 'days' },
    
  },
  {
    text: "Bereid je toast voor",
    relativeDueDate: { value: 13, unit: 'days' },
    
  },
  {
    text: "Maak een lijst met bruiloft-liedjes",
    relativeDueDate: { value: 13, unit: 'days' },
    
  },
  {
    text: "Bevestig details en betalingen met jullie leveranciers",
    relativeDueDate: { value: 7, unit: 'days' },
    
  },
  {
    text: "Bevesteg details en dagschema met de bruiloftsgasten", // Typo "Bevesteg" kept from input
    relativeDueDate: { value: 7, unit: 'days' },
    
  },
  {
    text: "Maak de tafelsetting af",
    relativeDueDate: { value: 7, unit: 'days' },
    
  },
  {
    text: "Schrijf een lief briefje voor je partner",
    relativeDueDate: { value: 7, unit: 'days' },
    
  },
  {
    text: "Ruim je huis op (tenzij je daar niet gaat klaarmaken voor de bruiloft ;))",
    relativeDueDate: { value: 1, unit: 'days' },
    
  },
  {
    text: "Breng decoratie naar de trouwlocatie als dit nodig is",
    relativeDueDate: { value: 1, unit: 'days' },
    
  },
  {
    text: "Probeer je te ontspannen!",
    relativeDueDate: { value: 1, unit: 'days' },
    
  },
  {
    text: "Woohoo! Het is jullie trouwdag!",
    relativeDueDate: { value: 0, unit: 'days' },
    
  },
  {
    text: "Neem een stuk bruidstaart mee wat over is",
    relativeDueDate: { value: 0, unit: 'days' },
    
  },
  {
    text: "Verzamel de cadeaus (of laat die doen)",
    relativeDueDate: { value: 0, unit: 'days' },
    
  },
  {
    text: "Breng gehuurde items terug",
    relativeDueDate: { value: -2, unit: 'days' },
    
  },
  {
    text: "Laat het bruidsboeket prepareren",
    relativeDueDate: { value: -4, unit: 'days' },
    
  },
  {
    text: "Laat de trouwjurk en het trouwpak reinigen",
    relativeDueDate: { value: -4, unit: 'days' },
    
  },
  {
    text: "Geef jullie favoriete leveranciers een review op Google",
    relativeDueDate: { value: -13, unit: 'days' },
     
  },
  {
    text: "Update jullie verzekeringen",
    relativeDueDate: { value: -41, unit: 'days' },
    
  },
  {
    text: "Regel het papierwerk voor het veranderen van jullie naam",
    relativeDueDate: { value: -41, unit: 'days' },
     
  },
  {
    text: "Bestel trouwfoto's en een album",
    relativeDueDate: { value: -55, unit: 'days' },
     
  },
  {
    text: "Deel jullie foto's en video!",
    relativeDueDate: { value: -60, unit: 'days' },
    
  },
];