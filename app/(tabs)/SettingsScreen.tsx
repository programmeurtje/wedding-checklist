import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { useRouter } from "expo-router";
import { ASYNC_STORAGE_KEYS } from "../../constants/appConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { AdminTasksModal } from "../../components/AdminTasksModal";

export default function SettingsScreen() {
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const router = useRouter();

  // Custom datepicker state
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const loadWeddingDate = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedDateStr = await AsyncStorage.getItem(
        ASYNC_STORAGE_KEYS.WEDDING_DATE
      );
      if (isValidDateString(storedDateStr)) {
        setWeddingDate(new Date(storedDateStr!));
      } else {
        setWeddingDate(null);
      }
    } catch (error) {
      console.error("Failed to load wedding date", error);
      Alert.alert("Fout", "Instellingen konden niet geladen worden.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeddingDate();
  }, [loadWeddingDate]);

  // Custom datepicker functions
  const openDatePicker = () => {
    const today = new Date();
    setSelectedMonth(weddingDate ? weddingDate.getMonth() : today.getMonth());
    setSelectedYear(
      weddingDate ? weddingDate.getFullYear() : today.getFullYear()
    );
    setSelectedDay(weddingDate ? weddingDate.getDate() : null);
    setIsDatePickerVisible(true);
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

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

  const confirmDate = () => {
    if (!selectedDay) return;

    const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);

    // Check if date is in the past
    if (selectedDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      Alert.alert(
        "Ongeldige datum",
        "Selecteer vandaag of een toekomstige datum."
      );
      return;
    }

    setWeddingDate(selectedDate);
    setIsDatePickerVisible(false);
    setSelectedDay(null);
  };

  const saveWeddingDate = async () => {
    if (!weddingDate) {
      Alert.alert("Geen datum geselecteerd", "Selecteer eerst een trouwdatum.");
      return;
    }
    if (weddingDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      Alert.alert(
        "Ongeldige datum",
        "Selecteer een datum in de toekomst voordat je opslaat."
      );
      return;
    }

    try {
      setIsLoading(true);
      await AsyncStorage.setItem(
        ASYNC_STORAGE_KEYS.WEDDING_DATE,
        weddingDate.toISOString()
      );
      setIsLoading(false);
      Alert.alert(
        "Succes",
        "Trouwdatum opgeslagen! Je checklistdata worden bijgewerkt wanneer je teruggaat."
      );
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to save wedding date", error);
      Alert.alert("Fout", "Kon de trouwdatum niet opslaan.");
    }
  };

  const confirmClearData = () => {
    Alert.alert(
      "App-gegevens resetten",
      "Weet je zeker dat je alle taken en je opgeslagen trouwdatum wilt verwijderen? Dit kan niet ongedaan gemaakt worden.",
      [
        { text: "Annuleren", style: "cancel" },
        {
          text: "Gegevens resetten",
          style: "destructive",
          onPress: clearAppData,
        },
      ]
    );
  };

  const clearAppData = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.multiRemove([
        ASYNC_STORAGE_KEYS.WEDDING_DATE,
        ASYNC_STORAGE_KEYS.TASKS,
      ]);
      setWeddingDate(null);
      setIsLoading(false);
      Alert.alert("Gegevens verwijderd", "Alle gegevens zijn verwijderd.");
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to clear app data", error);
      Alert.alert("Fout", "Kon app-gegevens niet verwijderen.");
    }
  };

  if (isLoading && !isDatePickerVisible) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DA6F57" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instellingen</Text>

      <View style={styles.dateSection}>
        <Text style={styles.label}>Jullie trouwdatum:</Text>

        <TouchableOpacity
          onPress={openDatePicker}
          style={styles.datePickerButton}
          activeOpacity={0.8}
        >
          <View style={styles.dateInputContainer}>
            <MaterialIcons
              name="calendar-today"
              size={20}
              color="#DA6F57"
              style={styles.calendarIcon}
            />
            <Text style={styles.dateText}>
              {weddingDate
                ? format(weddingDate, "dd MMMM yyyy", { locale: nl })
                : "Selecteer datum"}
            </Text>
            <MaterialIcons
              name="arrow-drop-down"
              size={24}
              color="#777"
              style={styles.dropdownIcon}
            />
          </View>
        </TouchableOpacity>

        {/* Custom Date Picker Modal */}
        <Modal
          visible={isDatePickerVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsDatePickerVisible(false)}
        >
          <View style={styles.datePickerModalOverlay}>
            <View style={styles.datePickerModalContent}>
              <View style={styles.datePickerHeader}>
                <Text style={styles.datePickerTitle}>Selecteer Trouwdatum</Text>
                <TouchableOpacity
                  onPress={() => setIsDatePickerVisible(false)}
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
                  <MaterialIcons
                    name="chevron-left"
                    size={24}
                    color="#DA6F57"
                  />
                </TouchableOpacity>
                <Text style={styles.monthYearText}>
                  {format(
                    new Date(selectedYear, selectedMonth, 1),
                    "MMMM yyyy",
                    {
                      locale: nl,
                    }
                  )}
                </Text>
                <TouchableOpacity
                  onPress={handleNextMonth}
                  style={styles.monthNavButton}
                >
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color="#DA6F57"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.weekdayHeader}>
                {["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"].map(
                  (day, index) => (
                    <Text key={index} style={styles.weekdayText}>
                      {day}
                    </Text>
                  )
                )}
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
                    const cellDate = new Date(selectedYear, selectedMonth, day);
                    const isToday =
                      cellDate.toDateString() === new Date().toDateString();
                    const isPast =
                      cellDate < new Date(new Date().setHours(0, 0, 0, 0));

                    calendarCells.push(
                      <TouchableOpacity
                        key={`day-${day}`}
                        style={[
                          styles.calendarCell,
                          isSelected && styles.selectedCalendarCell,
                          isPast && styles.pastCalendarCell,
                        ]}
                        onPress={() => !isPast && handleDaySelect(day)}
                        disabled={isPast}
                      >
                        <Text
                          style={[
                            styles.calendarCellText,
                            isSelected && styles.selectedCalendarCellText,
                            isPast && styles.pastCalendarCellText,
                            isToday &&
                              !isSelected &&
                              styles.todayCalendarCellText,
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
                  onPress={confirmDate}
                  disabled={!selectedDay}
                >
                  <Text style={styles.datePickerConfirmText}>
                    {selectedDay
                      ? `Stel trouwdatum in: ${format(
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
      </View>

      <TouchableOpacity
        style={[styles.actionButton, !weddingDate && styles.disabledButton]}
        onPress={saveWeddingDate}
        disabled={!weddingDate || isLoading}
      >
        {isLoading && !isDatePickerVisible ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.actionButtonText}>Trouwdatum opslaan</Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={[styles.actionButton, styles.adminButton]}
        onPress={() => setShowAdminModal(true)}
        disabled={isLoading}
      >
        <Text style={styles.actionButtonText}>Admin: Beheer Default Taken</Text>
      </TouchableOpacity>
      <Text style={styles.warningText}>
        Voor beheerders: pas standaard taken aan voor alle gebruikers.
      </Text>

      <View style={styles.divider} />

      <TouchableOpacity
        style={[styles.actionButton, styles.clearButton]}
        onPress={confirmClearData}
        disabled={isLoading}
      >
        <Text style={styles.actionButtonText}>Gegevens resetten</Text>
      </TouchableOpacity>
      <Text style={styles.warningText}>Reset alle taken en de trouwdatum.</Text>

      <AdminTasksModal
        visible={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />
    </View>
  );
}

function isValidDateString(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9F6",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 50 : 50,
    backgroundColor: "#FFF9F6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  dateSection: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: "#555",
    marginBottom: 12,
    fontWeight: "500",
  },
  datePickerButton: {
    width: "100%",
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  calendarIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  dropdownIcon: {
    marginLeft: 5,
  },
  actionButton: {
    backgroundColor: "#DA6F57",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    height: 50,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#E0A093", // Faded theme color
    shadowOpacity: 0,
    elevation: 0,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 25,
  },

  adminButton: {
    backgroundColor: "#4CAF50", // Green for admin functions
  },
  clearButton: {
    backgroundColor: "#B71C1C", // Destructive red color
  },
  warningText: {
    fontSize: 12,
    color: "#757575",
    textAlign: "center",
    marginTop: -10, // Pull up slightly below button
  },
  // --- Custom Date Picker Modal Styles ---
  datePickerModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
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
    elevation: 15,
    zIndex: 10000,
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
  pastCalendarCell: {
    opacity: 0.3,
  },
  pastCalendarCellText: {
    color: "#999",
  },
  todayCalendarCellText: {
    color: "#DA6F57",
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
});
