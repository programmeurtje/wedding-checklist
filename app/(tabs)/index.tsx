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
  SectionList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";
import WeddingDateModal from "../../components/WeddingDateModal";
import uuid from "react-native-uuid";
import { format, parse, parseISO, isValid, compareAsc, addDays,subDays,subWeeks, subMonths,differenceInDays } from "date-fns";

import { ASYNC_STORAGE_KEYS, Task } from "../../constants/appConfig";
import { defaultTasks as defaultTaskTemplates } from "../../data/defaultTasks";
import {

  isValidDateString,
} from "../../utils/dateUtils";

// Type for our section data
interface TaskSection {
  title: string;
  data: Task[];
  monthSortKey: number; // Used for sorting sections
}

export default function ChecklistScreen() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [weddingDate, setWeddingDate] = useState<string | null>(null);
  const [isDateModalVisible, setIsDateModalVisible] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  // --- Data Loading and Initialization ---

  const calculateAllTaskDates = useCallback(
    (tasks: Task[], currentWeddingDate: string | null): Task[] => {
      if (!isValidDateString(currentWeddingDate)) {
        return tasks.map((task) => ({ ...task, calculatedDate: undefined }));
      }
      
      const today = new Date();
      
      return tasks.map((task) => {
        if (!task.relativeDueDate) {
          return { ...task, calculatedDate: undefined };
        }
        
        try {
          const weddingDate = new Date(currentWeddingDate!);
          let calculatedDate: Date | null = null;
          
          if (task.relativeDueDate && typeof task.relativeDueDate === 'object' && 'unit' in task.relativeDueDate) {
            // Handle percentage-based scheduling
            if (task.relativeDueDate.unit === 'percentage') {
              const totalPlanningDays = differenceInDays(weddingDate, today);
              
              // Ensure we have at least 1 day of planning
              if (totalPlanningDays <= 0) {
                calculatedDate = today;
              } else {
                // Calculate days from today based on percentage
                const daysFromToday = Math.round((totalPlanningDays * task.relativeDueDate.value) / 100);
                calculatedDate = addDays(today, daysFromToday);
              }
            } 
            // Handle fixed timeframes
            else {
              calculatedDate = subDays(weddingDate, task.relativeDueDate.value);
            }
          }
          
          // If calculated date is in the past, use tomorrow
          if (calculatedDate && differenceInDays(calculatedDate, today) < 0) {
            calculatedDate = addDays(today, 1);
          }
          
          return {
            ...task,
            calculatedDate: calculatedDate ? `By ${format(calculatedDate, 'MMM dd, yyyy')}` : undefined
          };
        } catch (error) {
          console.error("Error calculating date for task:", error);
          return { ...task, calculatedDate: undefined };
        }
      });
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
      const storedExpandedSections = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.EXPANDED_SECTIONS
      );

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
          completed: false
          // calculatedDate: calculateDateFromWedding(
          //   currentWeddingDate,
          //   template.relativeDueDate
          // ),
        }));
        await AsyncStorage.setItem(
          ASYNC_STORAGE_KEYS.TASKS,
          JSON.stringify(tasksToProcess)
        );
      }

      setAllTasks(tasksToProcess);

      // Load expanded sections state
      if (storedExpandedSections) {
        setExpandedSections(JSON.parse(storedExpandedSections));
      }

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

  const saveExpandedSections = async (sections: { [key: string]: boolean }) => {
    try {
      await AsyncStorage.setItem(
        ASYNC_STORAGE_KEYS.EXPANDED_SECTIONS,
        JSON.stringify(sections)
      );
    } catch (error) {
      console.error("Error saving expanded sections:", error);
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

  // --- Section Handling ---
  const toggleSection = (sectionTitle: string) => {
    const updatedSections = {
      ...expandedSections,
      [sectionTitle]: !expandedSections[sectionTitle],
    };
    setExpandedSections(updatedSections);
    saveExpandedSections(updatedSections);
  };

  // Helper function to get date from task
  const getTaskDate = (task: Task, weddingDateStr: string | null): Date | null => {
    if (!weddingDateStr || !task.relativeDueDate) return null;
  
    try {
      // If we already have a calculated date, use that
      if (task.calculatedDate) {
        const calculatedDate = new Date(task.calculatedDate);
        if (isValid(calculatedDate)) return calculatedDate;
      }
  
      // Otherwise calculate based on relativeDueDate
      const weddingDateObj = new Date(weddingDateStr);
      const today = new Date();
      
      if (typeof task.relativeDueDate === 'object' && 'unit' in task.relativeDueDate) {
        // Handle percentage-based dates
        if (task.relativeDueDate.unit === 'percentage') {
          const totalPlanningDays = differenceInDays(weddingDateObj, today);
          
          // Ensure we have at least 1 day of planning
          if (totalPlanningDays <= 0) {
            return today;
          }
          
          // Calculate days from today based on percentage
          const daysFromToday = Math.round((totalPlanningDays * task.relativeDueDate.value) / 100);
          return addDays(today, daysFromToday);
        } 
        // Handle fixed unit dates (days/weeks/months)
        else if (task.relativeDueDate.unit === 'days') {
          return addDays(weddingDateObj, -task.relativeDueDate.value);
        } 
        else if (task.relativeDueDate.unit === 'weeks') {
          return subWeeks(weddingDateObj, task.relativeDueDate.value);
        }
        else if (task.relativeDueDate.unit === 'months') {
          return subMonths(weddingDateObj, task.relativeDueDate.value);
        }
      }
      
      return null;
    } catch (e) {
      console.error("Error parsing date for task:", e);
      return null;
    }
  };
  

  // --- Filtering, Grouping, and Sorting for Display ---
  const taskSections = useMemo(() => {
    // 1. Filter incomplete tasks
    const filtered = allTasks.filter((task) => !task.completed);
    
    // 2. Group tasks by month
    const groupedByMonth: { [key: string]: Task[] } = {};
    const monthSortKeys: { [key: string]: number } = {};
    
    // Special section for tasks without dates
    groupedByMonth["No Date"] = [];
    monthSortKeys["No Date"] = Number.MAX_SAFE_INTEGER; // Sort to the end
    
    filtered.forEach(task => {
      let dateObj = null;
      
      if (task.calculatedDate) {
        // Try to use the calculated date first
        try {
          dateObj = parseISO(task.calculatedDate);
          if (!isValid(dateObj)) dateObj = null;
        } catch (e) {
          dateObj = null;
        }
      } 
      
      // If no calculated date, try to calculate from relative date
      if (!dateObj && weddingDate && task.relativeDueDate) {
        dateObj = getTaskDate(task, weddingDate);
      }
      
      if (dateObj && isValid(dateObj)) {
        const monthYear = format(dateObj, "MMMM yyyy");
        
        // Store a numerical value for sorting (year * 100 + month)
        if (!monthSortKeys[monthYear]) {
          const year = dateObj.getFullYear();
          const month = dateObj.getMonth() + 1; // 0-indexed to 1-indexed
          monthSortKeys[monthYear] = year * 100 + month;
        }
        
        if (!groupedByMonth[monthYear]) {
          groupedByMonth[monthYear] = [];
        }
        groupedByMonth[monthYear].push(task);
      } else {
        groupedByMonth["No Date"].push(task);
      }
    });
    
    // 3. Convert to array and sort by month
    const sections: TaskSection[] = Object.keys(groupedByMonth).map(monthYear => ({
      title: monthYear,
      data: groupedByMonth[monthYear],
      monthSortKey: monthSortKeys[monthYear]
    }));
    
    // Sort sections chronologically
    sections.sort((a, b) => a.monthSortKey - b.monthSortKey);
    
    // Remove empty sections
    return sections.filter(section => section.data.length > 0);
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
  
        {/* Row for Date - only shown if it exists */}
        {item.calculatedDate ? (
          <View style={styles.detailsRow}>
            <View style={styles.detailsSpacer} />
            <View style={styles.detailItem}>
              <MaterialIcons
                name="calendar-today"
                size={14}
                color={styles.detailText.color}
                style={styles.iconStyle}
              />
              <Text style={styles.detailText}>{item.calculatedDate}</Text>
            </View>
          </View>
        ) : null}
  
        {/* Link as a separate block */}
        {item.link ? (
          <TouchableOpacity
            onPress={handleLinkPress}
            style={styles.linkBlock}
          >
            <MaterialIcons
              name="lightbulb-outline"
              size={18}
              color="#FFFFFF"
              style={styles.linkIconStyle}
            />
            <Text style={styles.linkBlockText}>Inspire me!</Text>
            <MaterialIcons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
              style={styles.arrowIconStyle}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };
  

  const renderSectionHeader = ({ section }: { section: TaskSection }) => {
    return (
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={() => toggleSection(section.title)}
        activeOpacity={0.7}
      >
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionCount}>{section.data.length}</Text>
        </View>
        <MaterialIcons 
          name={expandedSections[section.title] ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
          size={24} 
          color="#666"
        />
      </TouchableOpacity>
    );
  };

  // Fixed renderItem function that doesn't use conditional rendering
  const renderSectionItem = ({ item, section }: { item: Task, section: TaskSection }) => {
    // Only render if section is expanded
    if (!expandedSections[section.title]) {
      // Return an empty view with zero height instead of null
      return <View style={{ height: 0 }} />;
    }
    return renderTaskItem({ item });
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

      {/* Task List as SectionList */}
      <SectionList
        sections={taskSections}
        renderItem={renderSectionItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={true}
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

// --- Extended Styles ---
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
  // --- Section Styles ---
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#F9EAE5",  // Light theme color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DA6F57", // Theme color
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: "#DA6F57",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  sectionCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  // --- Task Card Styles ---
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 4,
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
  linkBlock: {
    backgroundColor: "#DA6F57",
    borderRadius: 8,
    marginTop: 8,
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkBlockText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  linkIconStyle: {
    marginRight: 6,
  },
  arrowIconStyle: {
    marginLeft: 6,
  }
});