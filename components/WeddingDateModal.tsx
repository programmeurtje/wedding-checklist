import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { MaterialIcons } from "@expo/vector-icons";

interface WeddingDateModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveDate: (date: string) => void;
}

export default function WeddingDateModal({
  visible,
  onClose,
  onSaveDate,
}: WeddingDateModalProps) {
  const [date, setDate] = useState(() => new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (event.type === "set" && selectedDate) {
      if (selectedDate < new Date(new Date().setHours(0, 0, 0, 0))) {
        Alert.alert(
          "Ongeldige datum",
          "Selecteer vandaag of een toekomstige datum voor je bruiloft."
        );
        return;
      }
      setDate(selectedDate);
    }
  };

  const handleSave = () => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      Alert.alert(
        "Ongeldige datum",
        "Selecteer vandaag of een toekomstige datum voordat je opslaat."
      );
      return;
    }
    onSaveDate(date.toISOString());
  };

  const triggerPicker = () => {
    setShowPicker(true);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Stel je trouwdatum in</Text>
          <Text style={styles.modalText}>
            Dit helpt ons om je checklist-tijdlijn af te stemmen!
          </Text>

          {Platform.OS === "ios" ? (
            <View style={styles.dateDisplay}>
              <MaterialIcons name="calendar-today" size={20} color="#555" />
              <Text style={styles.dateDisplayText}>
                {format(date, "dd MMMM yyyy", { locale: nl })}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={triggerPicker}
              style={styles.androidPickerButton}
            >
              <MaterialIcons name="calendar-today" size={20} color="#DA6F57" />
              <Text style={styles.androidPickerButtonText}>
                {format(date, "dd MMMM yyyy", { locale: nl })}
              </Text>
            </TouchableOpacity>
          )}

          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChange}
              minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
              style={styles.datePicker}
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={handleSave}
            >
              <Text style={styles.textStyle}>Trouwdatum opslaan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#FFF9F6",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
    fontSize: 14,
  },
  // --- Input Display/Trigger Styles ---
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
  },
  dateDisplayText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  androidPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DA6F57",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: "80%",
  },
  androidPickerButtonText: {
    marginLeft: 10,
    color: "#DA6F57",
    fontSize: 16,
    fontWeight: "500",
  },
  // --- Picker Style ---
  datePicker: {
    width: Platform.OS === "ios" ? "100%" : undefined,
    height: Platform.OS === "ios" ? 150 : undefined,
    marginBottom: Platform.OS === "ios" ? 15 : 0,
  },
  // --- Button Styles ---
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 15,
  },
  button: {
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 25,
    elevation: 2,
    minWidth: 120,
    alignItems: "center",
  },
  buttonSave: {
    backgroundColor: "#DA6F57",
  },
  buttonClose: {
    backgroundColor: "#A0A0A0",
    marginLeft: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
