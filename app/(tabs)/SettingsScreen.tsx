import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DatePickerModal } from "react-native-paper-dates";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { useRouter } from "expo-router";
import { ASYNC_STORAGE_KEYS } from "../../constants/appConfig";
import { MaterialIcons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const [weddingDate, setWeddingDate] = useState<Date | null>(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  const onDismiss = () => {
    setDatePickerVisible(false);
  };

  const onConfirm = ({ date }: { date: Date | undefined }) => {
    setDatePickerVisible(false);
    if (!date) {
      Alert.alert(
        "Ongeldige datum",
        "Selecteer vandaag of een toekomstige datum."
      );
      return;
    }
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      Alert.alert(
        "Ongeldige datum",
        "Selecteer vandaag of een toekomstige datum."
      );
      return;
    }
    setWeddingDate(date);
  };

  const toggleDatePicker = () => {
    setDatePickerVisible(true);
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

  if (isLoading && !datePickerVisible) {
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
          onPress={toggleDatePicker}
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

        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={(date) => {
            // The DateTimePickerModal returns a Date object directly
            if (!date) {
              Alert.alert(
                "Ongeldige datum",
                "Selecteer vandaag of een toekomstige datum."
              );
              return;
            }
            if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
              Alert.alert(
                "Ongeldige datum",
                "Selecteer vandaag of een toekomstige datum."
              );
              return;
            }
            setWeddingDate(date);
            setDatePickerVisible(false);
          }}
          onCancel={() => setDatePickerVisible(false)}
          minimumDate={new Date()}
          confirmTextIOS="Bevestigen"
          cancelTextIOS="Annuleren"
        />
      </View>

      <TouchableOpacity
        style={[styles.actionButton, !weddingDate && styles.disabledButton]}
        onPress={saveWeddingDate}
        disabled={!weddingDate || isLoading}
      >
        {isLoading && !datePickerVisible ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.actionButtonText}>Trouwdatum opslaan</Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        style={[styles.actionButton, styles.clearButton]}
        onPress={confirmClearData}
        disabled={isLoading}
      >
        <Text style={styles.actionButtonText}>Gegevens resetten</Text>
      </TouchableOpacity>
      <Text style={styles.warningText}>Reset alle taken en de trouwdatum.</Text>
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
    paddingTop: Platform.OS === "android" ? 30 : 50,
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
  clearButton: {
    backgroundColor: "#B71C1C", // Destructive red color
  },
  warningText: {
    fontSize: 12,
    color: "#757575",
    textAlign: "center",
    marginTop: -10, // Pull up slightly below button
  },
});
