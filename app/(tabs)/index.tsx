import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";
import WeddingDateModal from "../../components/WeddingDateModal";
import uuid from "react-native-uuid";

// Define Task Type
type Task = {
  id: string;
  text: string;
  completed: boolean;
  date?: string;
  link?: string;
};

const defaultTasks: Task[] = [
  {
    id: uuid.v4() as string,
    text: "Book Venue",
    completed: false,
    link: "https://www.example.com/book-venue",
  },
  {
    id: uuid.v4() as string,
    text: "Hire Photographer",
    completed: false,
    link: "https://www.example.com/hire-photographer",
  },
  {
    id: uuid.v4() as string,
    text: "Send Invitations",
    completed: false,
    link: "https://www.example.com/send-invitations",
  },
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
      const storedDate = await AsyncStorage.getItem("weddingDate");
      if (!storedDate) {
        setModalVisible(true);
      } else {
        setWeddingDate(storedDate);
      }
    } catch (error) {
      console.error("Failed to load wedding date", error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks) as Task[]);
      } else {
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
    const newTaskObj: Task = {
      id: uuid.v4() as string,
      text: newTask,
      completed: false,
    };
    const updatedTasks = [...tasks, newTaskObj];

    saveTasks(updatedTasks);
    setNewTask(""); // Clear input field
  };

  // Mark task as completed
  const completeTask = async (task: Task) => {
    const updatedTasks = tasks.filter((t) => t.id !== task.id);
    const completedTask = { ...task, completed: true };
    const completedTasks = await getCompletedTasks();

    // Check if the task is already in the completed tasks list
    if (!completedTasks.some((t) => t.id === task.id)) {
      completedTasks.push(completedTask);
    }

    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    await AsyncStorage.setItem(
      "completedTasks",
      JSON.stringify(completedTasks)
    );

    setTasks(updatedTasks);
  };

  // Get completed tasks from AsyncStorage
  const getCompletedTasks = async (): Promise<Task[]> => {
    const storedCompletedTasks = await AsyncStorage.getItem("completedTasks");
    return storedCompletedTasks
      ? (JSON.parse(storedCompletedTasks) as Task[])
      : [];
  };

  return (
    <View style={styles.container}>
      <WeddingDateModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
          <TouchableOpacity
            style={[
              styles.taskCard,
              item.completed && styles.completedTaskCard,
            ]}
          >
            <View style={styles.taskContent}>
              <CheckBox
                checked={item.completed}
                onPress={() => completeTask(item)}
                checkedColor="#DA6F57"
                containerStyle={styles.checkboxContainer}
              />
              <View style={styles.taskContainer}>
                <View style={styles.taskTextWrapper}>
                  <Text
                    style={[
                      styles.taskText,
                      item.completed && styles.completedTaskText,
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
                {item.link && (
                  <View style={styles.taskLinkWrapper}>
                    <View style={styles.verticalLine} />
                    <Text
                      style={styles.taskLink}
                      onPress={() => item.link && Linking.openURL(item.link)}
                    >
                      Inspire me!
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {item.date && <Text style={styles.taskDate}>{item.date}</Text>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks available</Text>
        }
      />

      {/* Navigate to Completed Tasks */}
      <TouchableOpacity
        style={styles.completedButton}
        onPress={() => router.push("/(tabs)/CompletedTaskScreen")}
      >
        <Text style={styles.buttonText}>View Completed Tasks</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF9F6" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
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

  //Task Styles
  taskCard: {
    padding: 5,
    marginVertical: 5,
    backgroundColor: "#F7F9FC",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  completedTaskCard: {
    backgroundColor: "#E0E0E0",
  },
  taskContent: { flexDirection: "row", alignItems: "center" },
  checkboxContainer: {
    margin: 0,
    padding: 0,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  taskTextWrapper: {
    flex: 1,
    paddingRight: 5,
  },
  taskText: {
    flexWrap: "wrap",
    fontSize: 16,
    color: "#DA6F57",
  },
  taskLinkWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  verticalLine: {
    width: 3,
    alignSelf: "stretch",
    backgroundColor: "#DA6F57",
    marginRight: 15,
  },
  taskLink: {
    fontSize: 14,
    color: "#A9A9A9",
  },
  //taskTextContainer: { flex: 1, marginLeft: 10, flexDirection: "row", alignItems: "center" },
  //taskText: { fontSize: 16, color: "#DA6F57" },
  // verticalLine: {
  //   width: 3,
  //   alignSelf: "stretch",
  //   backgroundColor: '#DA6F57',
  //   marginHorizontal: 10,
  // },
  // taskLink: { fontSize: 14, color: "#A9A9A9", textDecorationLine: "underline" },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  taskDate: { fontSize: 14, color: "#888" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#888" },
  completedButton: {
    padding: 15,
    backgroundColor: "#DA6F57",
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { textAlign: "center", color: "#FFF", fontWeight: "bold" },
});
