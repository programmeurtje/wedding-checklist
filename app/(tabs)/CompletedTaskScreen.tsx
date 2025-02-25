import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";

type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export default function CompletedTaskScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadCompletedTasks();
    }, [])
  );

  const loadCompletedTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("completedTasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks) as Task[]);
      }
    } catch (error) {
      console.error("Failed to load completed tasks", error);
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      await AsyncStorage.setItem("completedTasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Failed to remove task", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Text style={styles.taskText}>{item.text}</Text>
            <TouchableOpacity onPress={() => removeTask(item.id)}>
              <MaterialIcons name="delete" size={24} color="#DA6F57" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/(tabs)")}>
        <Text style={styles.buttonText}>Back to Checklist</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F6", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#DA6F57", marginBottom: 10 },
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F7F9FC",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskText: { fontSize: 16 },
  backButton: {
    backgroundColor: "#DA6F57",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#FFF9F6", fontSize: 16, fontWeight: "bold" },
});