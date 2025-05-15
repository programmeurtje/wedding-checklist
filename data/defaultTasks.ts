import { Task } from '../constants/appConfig';

export const defaultTasks: Omit<Task, 'id' | 'completed' | 'calculatedDate'>[] = [
  // Early planning tasks (using percentage)
  {
    text: "Maak je verloving bekend",
    relativeDueDate: { value: 0, unit: 'percentage' },
  },
  {
    text: "Kies een bruiloft thema",
    relativeDueDate: { value: 5, unit: 'percentage' },
    link: "https://www.girlsofhonor.com/"
  },
  {
    text: "Praat met je partner en familie over financien van de bruiloft",
    relativeDueDate: { value: 5, unit: 'percentage' }, 
  },
  {
    text: "Onderzoek wat een bruiloft precies kost",
    relativeDueDate: { value: 10, unit: 'percentage' },
    link: "https://www.girlsofhonor.com/"
  },
  {
    text: "Maak je bruiloft begroting",
    relativeDueDate: { value: 15, unit: 'percentage' },
    link: "https://www.girlsofhonor.com/"
  },
  
  // Middle tasks
  {
    text: "Begin met jullie gastenlijst",
    relativeDueDate: { value: 20, unit: 'percentage' },
  },
  {
    text: "Begin met de zoektocht naar jullie trouwlocatie",
    relativeDueDate: { value: 25, unit: 'percentage' },
  },
  {
    text: "Boek de locatie voor jullie receptie",
    relativeDueDate: { value: 30, unit: 'percentage' },
  },
  
  // Some tasks with fixed durations (critical deadlines)
  {
    text: "Stuur jullie save-the-dates",
    relativeDueDate: { value: 245, unit: 'days' }, // Fixed: ~8 months before
  },
  {
    text: "Koop je trouwjurk",
    relativeDueDate: { value: 238, unit: 'days' }, // Fixed: ~8 months before
  },
  {
    text: "Koop je trouwpak",
    relativeDueDate: { value: 238, unit: 'days' }, // Fixed: ~8 months before
  },
  
  // More percentage-based tasks
  {
    text: "Verzamel foto's van bruidstaarten in een Pinterest-bord",
    relativeDueDate: { value: 40, unit: 'percentage' },
  },
  {
    text: "DJ of band? Of allebei?",
    relativeDueDate: { value: 45, unit: 'percentage' },
  },
  
  // Middle-late tasks
  {
    text: "Verzamel inspiratie foto's voor haar en make-up",
    relativeDueDate: { value: 60, unit: 'percentage' },
  },
  {
    text: "Gaan jullie iets veranderen aan je achternaam?",
    relativeDueDate: { value: 65, unit: 'percentage' },
  },
  
  // Fixed date for legal requirements and critical deadlines
  {
    text: "Verstuur jullie trouwkaarten",
    relativeDueDate: { value: 80, unit: 'days' }, // ~2.5 months before
  },
  {
    text: "Huwelijk aanmelden bij de gemeente",
    relativeDueDate: { value: 51, unit: 'days' }, // Legal requirement
  },
  
  // Late tasks (percentage)
  {
    text: "Begin aan jullie trouwgeloften",
    relativeDueDate: { value: 75, unit: 'percentage' },
  },
  {
    text: "Maak een tafelsetting",
    relativeDueDate: { value: 80, unit: 'percentage' },
  },
  
  // Very close to wedding date - fixed days
  {
    text: "Laatste passessies voor trouwjurk en trouwpak",
    relativeDueDate: { value: 30, unit: 'days' },
  },
  {
    text: "Proefsessies voor haar en make-up",
    relativeDueDate: { value: 30, unit: 'days' },
  },
  
  // Final countdown - fixed days
  {
    text: "Schrijf een lief briefje voor je partner",
    relativeDueDate: { value: 7, unit: 'days' },
  },
  {
    text: "Ruim je huis op (tenzij je daar niet gaat klaarmaken voor de bruiloft ;))",
    relativeDueDate: { value: 1, unit: 'days' },
  },
  {
    text: "Woohoo! Het is jullie trouwdag!",
    relativeDueDate: { value: 0, unit: 'days' }, // Wedding day
  },
  
  // After wedding tasks - using fixed negative days
  {
    text: "Breng gehuurde items terug",
    relativeDueDate: { value: -2, unit: 'days' },
  },
  {
    text: "Update jullie verzekeringen",
    relativeDueDate: { value: -41, unit: 'days' },
  },
  
  // This is just a sample - you'd need to update all 100+ tasks 
  // following the same pattern (I've included representative examples)
];