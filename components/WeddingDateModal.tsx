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
import { DatePickerModal } from "react-native-paper-dates";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setFullYear(today.getFullYear() + 1);
    return today;
  });
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const onDismiss = () => {
    setDatePickerVisible(false);
  };

  const onConfirm = ({ date }: { date: Date | undefined }) => {
    if (!date) return;
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      Alert.alert(
        "Ongeldige datum",
        "Selecteer vandaag of een toekomstige datum voor je bruiloft."
      );
      return;
    }
    setDate(date);
    setDatePickerVisible(false);
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
    setDatePickerVisible(true);
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
            Dit helpt ons om je checklist deadlines af te stemmen!
          </Text>

          <TouchableOpacity
            onPress={triggerPicker}
            style={styles.datePickerButton}
          >
            <MaterialIcons name="calendar-today" size={20} color="#DA6F57" />
            <Text style={styles.datePickerButtonText}>
              {format(date, "dd MMMM yyyy", { locale: nl })}
            </Text>
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
              setDate(date);
              setDatePickerVisible(false);
            }}
            onCancel={() => setDatePickerVisible(false)}
            minimumDate={new Date()}
            confirmTextIOS="Bevestigen"
            cancelTextIOS="Annuleren"
          />

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
  datePickerButton: {
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
  datePickerButtonText: {
    marginLeft: 10,
    color: "#DA6F57",
    fontSize: 16,
    fontWeight: "500",
  },
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
