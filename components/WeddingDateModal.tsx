// components/WeddingDateModal.tsx
import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns'; // For displaying selected date
import { MaterialIcons } from '@expo/vector-icons'; // For icon

interface WeddingDateModalProps {
  visible: boolean;
  onClose: () => void;
  onSaveDate: (date: string) => void; // Callback to save the chosen date string
}

export default function WeddingDateModal({ visible, onClose, onSaveDate }: WeddingDateModalProps) {
  // Initialize date state (e.g., start with today or a future date)
  const [date, setDate] = useState(() => {
      const initial = new Date();
      // initial.setDate(initial.getDate() + 1); // Start tomorrow? Or just today.
      return initial;
  });
  // State to control picker visibility, *especially* for Android modal
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios'); // Show inline on iOS by default

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Always hide picker on Android after interaction (select or cancel)
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    // Proceed only if a date was selected (event type 'set')
    if (event.type === 'set' && selectedDate) {
       // Optional: Add validation (e.g., prevent past dates)
       if (selectedDate < new Date(new Date().setHours(0, 0, 0, 0))) { // Compare dates only
         Alert.alert("Invalid Date", "Please select today or a future date for your wedding.");
         return; // Don't update state if invalid
       }
       setDate(selectedDate); // Update the state with the valid selected date
    }
    // If event.type is 'dismissed' (Android cancel), we just hide the picker (already done above)
    // and don't update the date state.
  };

  const handleSave = () => {
     // Final validation before saving (redundant if onChange validates, but safe)
     if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
       Alert.alert("Invalid Date", "Please select today or a future date before saving.");
       return;
     }
    onSaveDate(date.toISOString()); // Save date as ISO string
    // We don't call onClose() here - the parent component (ChecklistScreen)
    // should close the modal *after* successfully saving the date via onSaveDate.
  };

  // Function specifically to show the picker (used by Android button)
  const triggerPicker = () => {
      setShowPicker(true);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Set Your Wedding Date</Text>
          <Text style={styles.modalText}>This helps us tailor your checklist timeline!</Text>

          {/* --- Input Trigger Area --- */}
          {Platform.OS === 'ios' ? (
            // On iOS, the picker is displayed directly below
            <View style={styles.dateDisplay}>
               <MaterialIcons name="calendar-today" size={20} color="#555" />
               <Text style={styles.dateDisplayText}>{format(date, 'MMMM dd, yyyy')}</Text>
            </View>
          ) : (
            // On Android, show a button to open the modal picker
            <TouchableOpacity onPress={triggerPicker} style={styles.androidPickerButton}>
               <MaterialIcons name="calendar-today" size={20} color="#DA6F57" />
               <Text style={styles.androidPickerButtonText}>
                  {format(date, 'MMMM dd, yyyy')}
               </Text>
            </TouchableOpacity>
          )}


          {/* --- DateTimePicker Component --- */}
          {/* Conditionally render for Android based on showPicker state */}
          {/* Always rendered but might be hidden on iOS if using 'default' display */}
          {showPicker && (
              <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'} // Spinner on iOS, Default (modal/spinner) on Android
                  onChange={onChange}
                  minimumDate={new Date(new Date().setHours(0, 0, 0, 0))} // Today is the minimum
                  style={styles.datePicker} // Apply style, especially for iOS spinner width
              />
          )}

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
             <TouchableOpacity
                 style={[styles.button, styles.buttonSave]}
                 onPress={handleSave}
             >
                 <Text style={styles.textStyle}>Save Wedding Date</Text>
             </TouchableOpacity>
             {/* Optional Close/Cancel Button */}
             {/* <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={onClose}>
                <Text style={styles.textStyle}>Cancel</Text>
             </TouchableOpacity> */}
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFF9F6',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10, 
      color: '#333',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
    fontSize: 14, 
  },
  // --- Input Display/Trigger Styles ---
  dateDisplay: { 
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginBottom: 10,
  },
  dateDisplayText: { 
      marginLeft: 10,
      fontSize: 16,
      color: '#333',
  },
  androidPickerButton: { 
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#DA6F57',
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginBottom: 20, 
      width: '80%', 
  },
  androidPickerButtonText: {
      marginLeft: 10,
      color: '#DA6F57',
      fontSize: 16,
      fontWeight: '500',
  },
  // --- Picker Style ---
  datePicker: {
      width: Platform.OS === 'ios' ? '100%' : undefined, 
      height: Platform.OS === 'ios' ? 150 : undefined, 
      marginBottom: Platform.OS === 'ios' ? 15 : 0,
  },
  // --- Button Styles ---
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      marginTop: 15, 
  },
  button: {
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 25, 
    elevation: 2,
    minWidth: 120, 
    alignItems: 'center',
  },
  buttonSave: {
    backgroundColor: '#DA6F57',
  },
  buttonClose: { 
     backgroundColor: '#A0A0A0',
     marginLeft: 10,
   },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});