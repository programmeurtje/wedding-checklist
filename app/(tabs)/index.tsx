import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import WeddingDateModal from "../../components/WeddingDateModal";

// Define Task Type
type Task = {
  id: number;
  text: string;
  completed: boolean;
  date?: string;
  link?: string;
};

const defaultTasks: Task[] = [
  { id: 1, text: "Book Venue", completed: false, link: "https://www.example.com/book-venue" },
  { id: 2, text: "Hire Photographer", completed: false, link: "https://www.example.com/hire-photographer" },
  { id: 3, text: "Send Invitations", completed: false, link: "https://www.example.com/send-invitations" },
];

export default function ChecklistScreen() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks); 
  const [newTask, setNewTask] = useState<string>(""); 
  const [weddingDate, setWeddingDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    checkWeddingDate();
    loadTasks();
  }, []);

  const checkWeddingDate = async () => {
    try {
      const storedDate = await AsyncStorage.getItem('weddingDate');
      if (!storedDate) {
        setModalVisible(true);
      } else {
        setWeddingDate(storedDate);
      }
    } catch (error) {
      console.error('Failed to load wedding date', error);
    }
  };

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks) as Task[]); // Cast to Task[]
        await AsyncStorage.setItem("tasks", JSON.stringify(defaultTasks));
        setTasks(defaultTasks);
      } else {
        // Save default tasks to AsyncStorage if no tasks are stored
        await AsyncStorage.setItem("tasks", JSON.stringify(defaultTasks));
        setTasks(defaultTasks);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  // Save tasks to AsyncStorage
  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  // Add new task
  const addTask = () => {
    if (!newTask.trim()) return; // Prevent empty tasks
    const newTaskObj: Task = { id: Date.now(), text: newTask, completed: false };
    const updatedTasks = [...tasks, newTaskObj];

    saveTasks(updatedTasks);
    setNewTask(""); // Clear input field
  };

  // Mark task as completed
  const completeTask = async (task: Task) => {
    const updatedTasks = tasks.filter((t) => t.id !== task.id);
    const completedTask = { ...task, completed: true };
    const completedTasks = [...(await getCompletedTasks()), completedTask];

    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    await AsyncStorage.setItem("completedTasks", JSON.stringify(completedTasks));

    setTasks(updatedTasks);
  };

  // Get completed tasks from AsyncStorage
  const getCompletedTasks = async (): Promise<Task[]> => {
    const storedCompletedTasks = await AsyncStorage.getItem("completedTasks");
    return storedCompletedTasks ? (JSON.parse(storedCompletedTasks) as Task[]) : [];
  };

  return (
    <View style={styles.container}>
      <WeddingDateModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      <Text style={styles.title}>Wedding Planner Checklist</Text>

      {/* Task Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask} // Add task when Enter key is pressed
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.taskCard} onPress={() => completeTask(item)}>
            <Text style={styles.taskText}>{item.text || "No text"}</Text>
            {item.date && <Text style={styles.taskDate}>{item.date}</Text>}
            {item.link && (
              <Text style={styles.taskLink} onPress={() => item.link && Linking.openURL(item.link)}>
                {item.link}
              </Text>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks available</Text>}
      />

      {/* Navigate to Completed Tasks */}
      <TouchableOpacity style={styles.completedButton} onPress={() => router.push("/(tabs)/CompletedTaskScreen")}>
        <Text style={styles.buttonText}>View Completed Tasks</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF9F6" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  inputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#DA6F57",
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#DA6F57",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  taskCard: { padding: 15, marginVertical: 5, backgroundColor: "#F7F9FC", borderRadius: 10 },
  taskText: { fontSize: 16, color: "#DA6F57" },
  taskDate: { fontSize: 14, color: "#888" },
  taskLink: { fontSize: 14, color: "#1E90FF", textDecorationLine: "underline" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#888" },
  completedButton: { padding: 15, backgroundColor: "#DA6F57", borderRadius: 10, marginTop: 20 },
  buttonText: { textAlign: "center", color: "#FFF", fontWeight: "bold" },
});