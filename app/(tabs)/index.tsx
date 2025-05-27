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
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";
import WeddingDateModal from "../../components/WeddingDateModal";
import ShortPlanningModal from "../../components/ShortPlanningModal";
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from "react-native-uuid";
import {
  format,
  parse,
  parseISO,
  isValid,
  compareAsc,
  addDays,
  subDays,
  subWeeks,
  subMonths,
  differenceInDays,
  differenceInMonths,
} from "date-fns";
import { nl } from "date-fns/locale";

import { ASYNC_STORAGE_KEYS, Task } from "../../constants/appConfig";
import { defaultTasks as defaultTaskTemplates } from "../../data/defaultTasks";

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
  const [isShortPlanningModalVisible, setIsShortPlanningModalVisible] =
    useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();

  // New state for task date picker
  const [isTaskDatePickerVisible, setIsTaskDatePickerVisible] =
    useState<boolean>(false);
  const [newTaskDate, setNewTaskDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

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

          if (
            task.relativeDueDate &&
            typeof task.relativeDueDate === "object" &&
            "unit" in task.relativeDueDate
          ) {
            // Handle percentage-based scheduling
            if (task.relativeDueDate.unit === "percentage") {
              const totalPlanningDays = differenceInDays(weddingDate, today);

              // Ensure we have at least 1 day of planning
              if (totalPlanningDays <= 0) {
                calculatedDate = today;
              } else {
                // Calculate days from today based on percentage
                const daysFromToday = Math.round(
                  (totalPlanningDays * task.relativeDueDate.value) / 100
                );
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
            calculatedDate: calculatedDate
              ? `Voor ${format(calculatedDate, "dd MMMM yyyy", { locale: nl })}`
              : undefined,
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
          completed: false,
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
      Alert.alert("Fout", "Kon je checklistgegevens niet laden.");
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
      const checkForChanges = async () => {
        try {
          const storedDate = await AsyncStorage.getItem(
            ASYNC_STORAGE_KEYS.WEDDING_DATE
          );
          const storedTasks = await AsyncStorage.getItem(
            ASYNC_STORAGE_KEYS.TASKS
          );

          const currentValidDate = isValidDateString(storedDate)
            ? storedDate
            : null;
          const currentTasks = storedTasks ? JSON.parse(storedTasks) : [];

          // Check if wedding date changed
          const dateChanged = currentValidDate !== weddingDate;

          // Check if tasks changed (compare length and completion status)
          const tasksChanged =
            currentTasks.length !== allTasks.length ||
            currentTasks.some(
              (task: Task, index: number) =>
                !allTasks[index] || task.completed !== allTasks[index].completed
            );

          if (dateChanged || tasksChanged) {
            console.log("Changes detected, reloading data...");
            loadAppData();
          }
        } catch (error) {
          console.error("Error checking for changes:", error);
        }
      };

      if (!isLoading) {
        checkForChanges();
      }
    }, [loadAppData, weddingDate, allTasks, isLoading])
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
      Alert.alert("Fout", "Kon je taakwijzigingen niet opslaan.");
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
      calculatedDate: newTaskDate
        ? `Voor ${format(newTaskDate, "dd MMMM yyyy", { locale: nl })}`
        : undefined,
    };

    if (newTaskDate) {
      newTaskObj.date = format(newTaskDate, "dd MMMM yyyy", { locale: nl });
      newTaskObj.calculatedDate = `Voor ${format(newTaskDate, "dd MMMM yyyy", {
        locale: nl,
      })}`;
    }

    saveTasks([newTaskObj, ...allTasks]);
    setNewTaskText("");
    setNewTaskDate(null);
    setSelectedDay(null);
  };

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = allTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  // --- Wedding Date Handling ---
  const checkIfShortPlanning = (dateString: string): boolean => {
    try {
      const weddingDateObj = new Date(dateString);
      const today = new Date();
      const monthsDifference = differenceInMonths(weddingDateObj, today);
      return monthsDifference <= 6 && monthsDifference >= 0;
    } catch (error) {
      console.error("Error checking short planning:", error);
      return false;
    }
  };

  const handleSaveWeddingDate = async (newDate: string) => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.WEDDING_DATE, newDate);
      setWeddingDate(newDate);
      const updatedTasks = calculateAllTaskDates(allTasks, newDate);
      saveTasks(updatedTasks);
      setIsDateModalVisible(false);

      // Check if wedding is within 6 months and show short planning modal
      if (checkIfShortPlanning(newDate)) {
        // Small delay to let the date modal close first
        setTimeout(() => {
          setIsShortPlanningModalVisible(true);
        }, 500);
      }
    } catch (error) {
      console.error("Failed to save wedding date:", error);
      Alert.alert("Fout", "Kon de trouwdatum niet opslaan.");
    }
  };

  // --- Date Picker for Task ---
  const openTaskDatePicker = () => {
    const today = new Date();
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
    setSelectedDay(null);
    setIsTaskDatePickerVisible(true);
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  function isValidDateString(dateStr: string | null | undefined): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  }

  const getDayArray = (month: number, year: number) => {
    const daysInMonth = getDaysInMonth(month, year);
    const dayArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      dayArray.push(i);
    }
    return dayArray;
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    const selectedDate = new Date(selectedYear, selectedMonth, day);
    setNewTaskDate(selectedDate);
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
    setSelectedDay(null);
  };

  const confirmTaskDate = () => {
    setIsTaskDatePickerVisible(false);
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
  const getTaskDate = (
    task: Task,
    weddingDateStr: string | null
  ): Date | null => {
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

      if (
        typeof task.relativeDueDate === "object" &&
        "unit" in task.relativeDueDate
      ) {
        // Handle percentage-based dates
        if (task.relativeDueDate.unit === "percentage") {
          const totalPlanningDays = differenceInDays(weddingDateObj, today);

          // Ensure we have at least 1 day of planning
          if (totalPlanningDays <= 0) {
            return today;
          }

          // Calculate days from today based on percentage
          const daysFromToday = Math.round(
            (totalPlanningDays * task.relativeDueDate.value) / 100
          );
          return addDays(today, daysFromToday);
        }
        // Handle fixed unit dates (days/weeks/months)
        else if (task.relativeDueDate.unit === "days") {
          return addDays(weddingDateObj, -task.relativeDueDate.value);
        } else if (task.relativeDueDate.unit === "weeks") {
          return subWeeks(weddingDateObj, task.relativeDueDate.value);
        } else if (task.relativeDueDate.unit === "months") {
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
    groupedByMonth["Geen Datum"] = [];
    monthSortKeys["Geen Datum"] = Number.MAX_SAFE_INTEGER; // Sort to the end

    filtered.forEach((task) => {
      let dateObj = null;

      // First check if the task has the new date property
      // First check if the task has the new date property
      if (task.date) {
        try {
          // Parse Dutch format date (e.g., "15 mei 2025")
          dateObj = parse(task.date, "dd MMMM yyyy", new Date(), {
            locale: nl,
          });
          if (!isValid(dateObj)) {
            // Fallback: try parsing as ISO string
            dateObj = parseISO(task.date);
            if (!isValid(dateObj)) dateObj = null;
          }
        } catch (e) {
          dateObj = null;
        }
      }
      // Then try the calculatedDate (for backward compatibility)
      else if (task.calculatedDate) {
        try {
          // match "Voor 15 mei 2025"
          const dateMatch = task.calculatedDate.match(
            /Voor\s+(\d{1,2}\s+[A-Za-zéû]+\s+\d{4})/
          );
          if (dateMatch && dateMatch[1]) {
            // parse with Dutch locale and no comma
            dateObj = parse(dateMatch[1], "dd MMMM yyyy", new Date(), {
              locale: nl,
            });
          }
          if (!isValid(dateObj)) dateObj = null;
        } catch {
          dateObj = null;
        }
      }

      // If no direct date property, try to calculate from relative date
      if (!dateObj && weddingDate && task.relativeDueDate) {
        dateObj = getTaskDate(task, weddingDate);
      }

      if (dateObj && isValid(dateObj)) {
        const monthYear = format(dateObj, "MMMM yyyy", { locale: nl });

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
        groupedByMonth["Geen Datum"].push(task);
      }
    });
    // 3. Sort tasks within each month by date
    Object.keys(groupedByMonth).forEach((monthYear) => {
      if (monthYear !== "Geen Datum") {
        groupedByMonth[monthYear].sort((a, b) => {
          const getTaskDateForSorting = (task: Task): Date | null => {
            // First try the date property
            if (task.date) {
              try {
                const dateObj = parse(task.date, "dd MMMM yyyy", new Date(), {
                  locale: nl,
                });
                if (isValid(dateObj)) return dateObj;
              } catch (e) {
                // Fallback to parseISO
                try {
                  const isoDate = parseISO(task.date);
                  if (isValid(isoDate)) return isoDate;
                } catch (e2) {
                  // Continue to calculatedDate
                }
              }
            }

            // Then try calculatedDate
            if (task.calculatedDate) {
              try {
                const dateMatch = task.calculatedDate.match(
                  /Voor\s+(\d{1,2}\s+[A-Za-zéû]+\s+\d{4})/
                );
                if (dateMatch && dateMatch[1]) {
                  const dateObj = parse(
                    dateMatch[1],
                    "dd MMMM yyyy",
                    new Date(),
                    { locale: nl }
                  );
                  if (isValid(dateObj)) return dateObj;
                }
              } catch (e) {
                // Continue to relative date calculation
              }
            }

            // Finally try calculating from relative date
            if (weddingDate && task.relativeDueDate) {
              return getTaskDate(task, weddingDate);
            }

            return null;
          };

          const dateA = getTaskDateForSorting(a);
          const dateB = getTaskDateForSorting(b);

          // If both have dates, sort by date (earliest first)
          if (dateA && dateB) {
            return compareAsc(dateA, dateB);
          }

          // Tasks with dates come before tasks without dates
          if (dateA && !dateB) return -1;
          if (!dateA && dateB) return 1;

          // If neither has a date, maintain original order
          return 0;
        });
      }
    });
    // 4. Convert to array and sort by month
    const sections: TaskSection[] = Object.keys(groupedByMonth).map(
      (monthYear) => ({
        title: monthYear,
        data: groupedByMonth[monthYear],
        monthSortKey: monthSortKeys[monthYear],
      })
    );

    // Sort sections chronologically
    sections.sort((a, b) => a.monthSortKey - b.monthSortKey);

    // Remove empty sections
    return sections.filter((section) => section.data.length > 0);
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
          <TouchableOpacity onPress={handleLinkPress} style={styles.linkBlock}>
            <MaterialIcons
              name="lightbulb-outline"
              size={18}
              color="#FFFFFF"
              style={styles.linkIconStyle}
            />
            <Text style={styles.linkBlockText}>Inspireer me!</Text>
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
          name={
            expandedSections[section.title]
              ? "keyboard-arrow-up"
              : "keyboard-arrow-down"
          }
          size={24}
          color="#666"
        />
      </TouchableOpacity>
    );
  };

  // Fixed renderItem function that doesn't use conditional rendering
  const renderSectionItem = ({
    item,
    section,
  }: {
    item: Task;
    section: TaskSection;
  }) => {
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
        <Text style={styles.loadingText}>Je checklist laden...</Text>
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
              "Trouwdatum Vereist",
              "Stel je trouwdatum in om door te gaan."
            );
          }
        }}
        onSaveDate={handleSaveWeddingDate}
      />

      <ShortPlanningModal
        visible={isShortPlanningModalVisible}
        onClose={() => setIsShortPlanningModalVisible(false)}
        blogUrl="https://www.girlsofhonour.nl/"
      />

      {/* Task Date Picker Modal */}
      <Modal
        visible={isTaskDatePickerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsTaskDatePickerVisible(false)}
      >
        <View style={styles.datePickerModalOverlay}>
          <View style={styles.datePickerModalContent}>
            <View style={styles.datePickerHeader}>
              <Text style={styles.datePickerTitle}>Selecteer Deadline</Text>
              <TouchableOpacity
                onPress={() => setIsTaskDatePickerVisible(false)}
                style={styles.datePickerCloseButton}
              >
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.monthSelector}>
              <TouchableOpacity
                onPress={handlePrevMonth}
                style={styles.monthNavButton}
              >
                <MaterialIcons name="chevron-left" size={24} color="#DA6F57" />
              </TouchableOpacity>
              <Text style={styles.monthYearText}>
                {format(new Date(selectedYear, selectedMonth, 1), "MMMM yyyy", {
                  locale: nl,
                })}
              </Text>
              <TouchableOpacity
                onPress={handleNextMonth}
                style={styles.monthNavButton}
              >
                <MaterialIcons name="chevron-right" size={24} color="#DA6F57" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekdayHeader}>
              {["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"].map((day, index) => (
                <Text key={index} style={styles.weekdayText}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {(() => {
                const days = getDayArray(selectedMonth, selectedYear);
                const firstDayOfMonth = new Date(
                  selectedYear,
                  selectedMonth,
                  1
                ).getDay();
                const calendarCells = [];

                // Add empty cells for days before the 1st of the month
                for (let i = 0; i < firstDayOfMonth; i++) {
                  calendarCells.push(
                    <View key={`empty-${i}`} style={styles.calendarCell} />
                  );
                }

                // Add cells for each day of the month
                days.forEach((day) => {
                  const isSelected = day === selectedDay;
                  calendarCells.push(
                    <TouchableOpacity
                      key={`day-${day}`}
                      style={[
                        styles.calendarCell,
                        isSelected && styles.selectedCalendarCell,
                      ]}
                      onPress={() => handleDaySelect(day)}
                    >
                      <Text
                        style={[
                          styles.calendarCellText,
                          isSelected && styles.selectedCalendarCellText,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                });

                return calendarCells;
              })()}
            </View>

            <View style={styles.datePickerFooter}>
              <TouchableOpacity
                style={[
                  styles.datePickerConfirmButton,
                  !selectedDay && styles.datePickerDisabledButton,
                ]}
                onPress={confirmTaskDate}
                disabled={!selectedDay}
              >
                <Text style={styles.datePickerConfirmText}>
                  {selectedDay
                    ? `Deadline instellen: ${format(
                        new Date(selectedYear, selectedMonth, selectedDay),
                        "dd MMMM yyyy",
                        { locale: nl }
                      )}`
                    : "Selecteer een datum"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>
        {weddingDate
          ? `Bruiloft: ${format(new Date(weddingDate), "dd MMMM yyyy", {
              locale: nl,
            })}`
          : "Bruiloft Checklist"}
      </Text>

      {/* Task Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Voeg een taak toe..."
            value={newTaskText}
            onChangeText={setNewTaskText}
            onSubmitEditing={newTaskText.trim() ? addTask : undefined}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.calendarButton}
            onPress={openTaskDatePicker}
          >
            <MaterialIcons
              name="event"
              size={22}
              color={newTaskDate ? "#DA6F57" : "#BDBDBD"}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={addTask}
          disabled={!newTaskText.trim()}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Display selected date if any */}
      {newTaskDate && (
        <View style={styles.selectedDateDisplay}>
          <MaterialIcons
            name="calendar-today"
            size={14}
            color="#DA6F57"
            style={styles.iconStyle}
          />
          <Text style={styles.selectedDateText}>
            Deadline: {format(newTaskDate, "dd MMMM yyyy", { locale: nl })}
          </Text>
          <TouchableOpacity onPress={() => setNewTaskDate(null)}>
            <MaterialIcons name="close" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {/* Task List as SectionList */}
      <SectionList
        sections={taskSections}
        renderItem={renderSectionItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={true}
        ListHeaderComponent={<Text style={styles.listHeader}>To do's</Text>}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {allTasks.length > 0
              ? "Hoera! Alle taken voltooid!"
              : "Nog geen taken. Voeg er een toe!"}
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
    paddingTop: Platform.OS === "android" ? 50 : 50,
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
    marginBottom: 5,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  calendarButton: {
    padding: 10,
    marginRight: 5,
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
  selectedDateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9EAE5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  selectedDateText: {
    fontSize: 14,
    color: "#DA6F57",
    marginHorizontal: 5,
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
  // --- Date Picker Modal Styles ---
  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerModalContent: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  datePickerCloseButton: {
    padding: 5,
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  monthNavButton: {
    padding: 8,
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DA6F57",
  },
  weekdayHeader: {
    flexDirection: "row",
    marginBottom: 10,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    color: "#666",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  calendarCell: {
    width: "14.28%", // 7 days per week (100% / 7)
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  calendarCellText: {
    fontSize: 14,
    color: "#333",
  },
  selectedCalendarCell: {
    backgroundColor: "#DA6F57",
    borderRadius: 20,
  },
  selectedCalendarCellText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  datePickerFooter: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 15,
    alignItems: "center",
  },
  datePickerConfirmButton: {
    backgroundColor: "#DA6F57",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  datePickerConfirmText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  datePickerDisabledButton: {
    backgroundColor: "#BDBDBD",
  },
  // --- Section Styles ---
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9EAE5", // Light theme color
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
  },
});
