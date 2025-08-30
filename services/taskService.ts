import { Task } from "../constants/appConfig";

// Interface for admin tasks (without id, completed, calculatedDate)
export interface AdminTask {
  text: string;
  relativeDueDate: {
    value: number;
    unit: "days" | "percentage";
  };
  link?: string;
}

// Firebase config - replace with your actual config
const FIREBASE_CONFIG = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};

// Fallback tasks if Firebase is unavailable
const fallbackTasks: AdminTask[] = [
  {
    text: "Maak je verloving bekend",
    relativeDueDate: { value: 0, unit: "percentage" },
  },
  {
    text: "Kies een bruiloft thema",
    relativeDueDate: { value: 5, unit: "percentage" },
    link: "https://www.girlsofhonor.com/",
  },
  {
    text: "Praat met je partner en familie over financien van de bruiloft",
    relativeDueDate: { value: 5, unit: "percentage" },
  },
  {
    text: "Onderzoek wat een bruiloft precies kost",
    relativeDueDate: { value: 10, unit: "percentage" },
    link: "https://www.girlsofhonor.com/",
  },
  {
    text: "Maak je bruiloft begroting",
    relativeDueDate: { value: 15, unit: "percentage" },
    link: "https://www.girlsofhonor.com/",
  },
  {
    text: "Begin met jullie gastenlijst",
    relativeDueDate: { value: 20, unit: "percentage" },
  },
  {
    text: "Begin met de zoektocht naar jullie trouwlocatie",
    relativeDueDate: { value: 25, unit: "percentage" },
  },
  {
    text: "Boek de locatie voor jullie receptie",
    relativeDueDate: { value: 30, unit: "percentage" },
  },
  {
    text: "Stuur jullie save-the-dates",
    relativeDueDate: { value: 245, unit: "days" },
  },
  {
    text: "Koop je trouwjurk",
    relativeDueDate: { value: 238, unit: "days" },
  },
  {
    text: "Koop je trouwpak",
    relativeDueDate: { value: 238, unit: "days" },
  },
  {
    text: "Verzamel foto's van bruidstaarten in een Pinterest-bord",
    relativeDueDate: { value: 40, unit: "percentage" },
  },
  {
    text: "DJ of band? Of allebei?",
    relativeDueDate: { value: 45, unit: "percentage" },
  },
  {
    text: "Verzamel inspiratie foto's voor haar en make-up",
    relativeDueDate: { value: 60, unit: "percentage" },
  },
  {
    text: "Gaan jullie iets veranderen aan je achternaam?",
    relativeDueDate: { value: 65, unit: "percentage" },
  },
  {
    text: "Verstuur jullie trouwkaarten",
    relativeDueDate: { value: 80, unit: "days" },
  },
  {
    text: "Huwelijk aanmelden bij de gemeente",
    relativeDueDate: { value: 51, unit: "days" },
  },
  {
    text: "Begin aan jullie trouwgeloften",
    relativeDueDate: { value: 75, unit: "percentage" },
  },
  {
    text: "Maak een tafelsetting",
    relativeDueDate: { value: 80, unit: "percentage" },
  },
  {
    text: "Laatste passessies voor trouwjurk en trouwpak",
    relativeDueDate: { value: 30, unit: "days" },
  },
  {
    text: "Proefsessies voor haar en make-up",
    relativeDueDate: { value: 30, unit: "days" },
  },
  {
    text: "Schrijf een lief briefje voor je partner",
    relativeDueDate: { value: 7, unit: "days" },
  },
  {
    text: "Ruim je huis op (tenzij je daar niet gaat klaarmaken voor de bruiloft ;))",
    relativeDueDate: { value: 1, unit: "days" },
  },
  {
    text: "Woohoo! Het is jullie trouwdag!",
    relativeDueDate: { value: 0, unit: "days" },
  },
  {
    text: "Breng gehuurde items terug",
    relativeDueDate: { value: -2, unit: "days" },
  },
  {
    text: "Update jullie verzekeringen",
    relativeDueDate: { value: -41, unit: "days" },
  },
];

class TaskService {
  private baseUrl =
    "https://wedding-planner-checklist-default-rtdb.europe-west1.firebasedatabase.app/";

  // Get default tasks from Firebase
  async getDefaultTasks(): Promise<AdminTask[]> {
    try {
      const response = await fetch(`${this.baseUrl}/defaultTasks.json`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // If no data exists, return fallback tasks
      if (!data || !Array.isArray(data)) {
        console.log("No tasks found in Firebase, using fallback tasks");
        return fallbackTasks;
      }

      return data;
    } catch (error) {
      console.error("Error fetching default tasks:", error);
      return fallbackTasks;
    }
  }

  // Update default tasks in Firebase (admin only)
  async updateDefaultTasks(
    tasks: AdminTask[],
    adminPassword: string
  ): Promise<boolean> {
    // Simple password protection - in production use proper authentication
    if (adminPassword !== "girlsofhonour2024") {
      throw new Error("Incorrect admin password");
    }

    try {
      const response = await fetch(`${this.baseUrl}/defaultTasks.json`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tasks),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error updating default tasks:", error);
      throw error;
    }
  }

  // Get admin authentication status
  async verifyAdminPassword(password: string): Promise<boolean> {
    return password === "girlsofhonour2024";
  }
}

export const taskService = new TaskService();
