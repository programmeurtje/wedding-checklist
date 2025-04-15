import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";
import WeddingDateModal from "../../components/WeddingDateModal";
import uuid from "react-native-uuid";
import { format } from "date-fns";

import { ASYNC_STORAGE_KEYS, Task } from "../../constants/appConfig";
import { defaultTasks as defaultTaskTemplates } from "../../data/defaultTasks";
import {
  calculateDateFromWedding,
  isValidDateString,
} from "../../utils/dateUtils";

export default function ChecklistScreen() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [weddingDate, setWeddingDate] = useState<string | null>(null);
  const [isDateModalVisible, setIsDateModalVisible] = useState<boolean>(false);
  const router = useRouter();

  // --- Data Loading and Initialization ---

  // Function to calculate dates for all tasks based on the wedding date
  const calculateAllTaskDates = useCallback(
    (tasks: Task[], currentWeddingDate: string | null): Task[] => {
      if (!isValidDateString(currentWeddingDate)) {
        return tasks.map((task) => ({ ...task, calculatedDate: undefined }));
      }
      return tasks.map((task) => ({
        ...task,
        calculatedDate: calculateDateFromWedding(
          currentWeddingDate,
          task.relativeDueDate
        ),
      }));
    },
    []
  );

  // Load wedding date and tasks
  const loadAppData = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedDate = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.WEDDING_DATE
      );
      const storedTasks = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.TASKS);

      let currentWeddingDate = isValidDateString(storedDate)
        ? storedDate
        : null;
      setWeddingDate(currentWeddingDate);

      let tasksToProcess: Task[] = [];

      if (storedTasks) {
        tasksToProcess = JSON.parse(storedTasks) as Task[];
        tasksToProcess = calculateAllTaskDates(
          tasksToProcess,
          currentWeddingDate
        );
      } else {
        tasksToProcess = defaultTaskTemplates.map((template) => ({
          ...template,
          id: uuid.v4() as string,
          completed: false,
          calculatedDate: calculateDateFromWedding(
            currentWeddingDate,
            template.relativeDueDate
          ),
        }));
        await AsyncStorage.setItem(
          ASYNC_STORAGE_KEYS.TASKS,
          JSON.stringify(tasksToProcess)
        );
      }

      setAllTasks(tasksToProcess);

      // Prompt for date if not set
      if (!currentWeddingDate) {
        setIsDateModalVisible(true);
      }
    } catch (error) {
      console.error("Error loading app data:", error);
      Alert.alert("Error", "Could not load your checklist data.");
    } finally {
      setIsLoading(false);
    }
  }, [calculateAllTaskDates]);

  // Load data on initial mount
  useEffect(() => {
    loadAppData();
  }, [loadAppData]);

  // Refresh data when the screen comes into focus (e.g., after changing date in settings)
  useFocusEffect(
    useCallback(() => {
      const checkDate = async () => {
        const storedDate = await AsyncStorage.getItem(
          ASYNC_STORAGE_KEYS.WEDDING_DATE
        );
        const currentValidDate = isValidDateString(storedDate)
          ? storedDate
          : null;
        if (currentValidDate !== weddingDate) {
          console.log("Wedding date change detected, reloading data...");
          loadAppData();
        }
      };
      if (!isLoading) {
        checkDate();
      }
    }, [loadAppData, weddingDate, isLoading])
  );

  // --- Task Management ---

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      setAllTasks(updatedTasks);
      await AsyncStorage.setItem(
        ASYNC_STORAGE_KEYS.TASKS,
        JSON.stringify(updatedTasks)
      );
    } catch (error) {
      console.error("Error saving tasks:", error);
      Alert.alert("Error", "Could not save your task changes.");
    }
  };

  const addTask = () => {
    if (!newTaskText.trim()) return;
    const newTaskObj: Task = {
      id: uuid.v4() as string,
      text: newTaskText.trim(),
      completed: false,
    };
    saveTasks([newTaskObj, ...allTasks]);
    setNewTaskText("");
  };

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = allTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  // --- Wedding Date Handling ---
  const handleSaveWeddingDate = async (newDate: string) => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.WEDDING_DATE, newDate);
      setWeddingDate(newDate);
      const updatedTasks = calculateAllTaskDates(allTasks, newDate);
      saveTasks(updatedTasks);
      setIsDateModalVisible(false);
    } catch (error) {
      console.error("Failed to save wedding date:", error);
      Alert.alert("Error", "Could not save the wedding date.");
    }
  };

  // --- Filtering and Sorting for Display ---
  const incompleteTasks = useMemo(() => {
    return allTasks
      .filter((task) => !task.completed)
      .sort((a, b) => {
        const dateA = a.calculatedDate
          ? new Date(
              calculateDateFromWedding(weddingDate, a.relativeDueDate) || 0
            )
          : null;
        const dateB = b.calculatedDate
          ? new Date(
              calculateDateFromWedding(weddingDate, b.relativeDueDate) || 0
            )
          : null;

        if (dateA && dateB) return dateA.getTime() - dateB.getTime();
        if (dateA && !dateB) return -1;
        if (!dateA && dateB) return 1;
        return 0;
      });
  }, [allTasks, weddingDate]);

  // --- Render Functions ---
  const renderTaskItem = ({ item }: { item: Task }) => {
    const handleLinkPress = () => {
      if (item.link) {
        Linking.openURL(item.link).catch((err) =>
          console.error("Couldn't load page", err)
        );
      }
    };

    return (
      <View style={styles.taskCard}>
        {/* Row for Checkbox and Main Content */}
        <View style={styles.taskRow}>
          <CheckBox
            checked={item.completed}
            onPress={() => toggleTaskCompletion(item.id)}
            checkedColor="#DA6F57"
            uncheckedColor="#BDBDBD"
            containerStyle={styles.checkboxContainer}
            size={24}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 0 }}
          />
          <View style={styles.mainContent}>
            <Text style={styles.taskTitle}>{item.text}</Text>
          </View>
        </View>

        {/* Row for Details (Date & Link) - only shown if they exist */}
        {(item.calculatedDate || item.link) ? (
          <View style={styles.detailsRow}>
            <View style={styles.detailsSpacer} />
            {/* Indent details */}
            {item.calculatedDate ? (
              <View style={styles.detailItem}>
                <MaterialIcons
                  name="calendar-today"
                  size={14}
                  color={styles.detailText.color}
                  style={styles.iconStyle}
                />
                <Text style={styles.detailText}>{item.calculatedDate}</Text>
              </View>
            ):  null}
            {item.calculatedDate && item.link ? (
              <View style={styles.detailSeparator} />
            ):null}{" "}
            {/* Separator */}
            {item.link ? (
              <TouchableOpacity
                onPress={handleLinkPress}
                style={styles.detailItem}
              >
                <MaterialIcons
                  name="lightbulb-outline"
                  size={16}
                  color={styles.linkText.color}
                  style={styles.iconStyle}
                />
                <Text style={styles.linkText}>Inspire me!</Text>
              </TouchableOpacity>
            ): null}
          </View>
        ): null}
      </View>
    );
  };

  // --- Main Return ---

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DA6F57" />
        <Text style={styles.loadingText}>Loading your checklist...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WeddingDateModal
        visible={isDateModalVisible}
        onClose={() => {
          if (weddingDate) {
            setIsDateModalVisible(false);
          } else {
            Alert.alert(
              "Wedding Date Required",
              "Please set your wedding date to continue."
            );
          }
        }}
        onSaveDate={handleSaveWeddingDate}
      />

      <Text style={styles.title}>
        {weddingDate
          ? `Wedding: ${format(new Date(weddingDate), "MMMM dd, yyyy")}`
          : "Wedding Checklist"}
      </Text>

      {/* Task Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a custom task..."
          value={newTaskText}
          onChangeText={setNewTaskText}
          onSubmitEditing={addTask}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={incompleteTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.listHeader}>Your Tasks</Text>}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {allTasks.length > 0
              ? "Woohoo! All tasks completed!"
              : "No tasks yet. Add one!"}
          </Text>
        }
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9F6",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#DA6F57",
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: Platform.OS === "android" ? 30 : 50,
    backgroundColor: "#FFF9F6",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#DA6F57",
    borderRadius: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 26,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#DA6F57",
    marginBottom: 10,
    marginLeft: 5,
  },
  // --- Task Card Styles ---
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    paddingRight: 10,
  },
  checkboxContainer: {
    padding: 0,
    margin: 0,
    marginRight: 5,
  },
  mainContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flexWrap: "wrap",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingLeft: 5,
    paddingRight: 10,
    flexWrap: "wrap",
  },
  detailsSpacer: {
    width: 24 + 5,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailSeparator: {
    width: 1,
    height: 14,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
  },
  iconStyle: {
    marginRight: 4,
  },
  detailText: {
    fontSize: 13,
    color: "#757575",
  },
  linkText: {
    fontSize: 13,
    color: "#DA6F57",
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#888",
  },
});
