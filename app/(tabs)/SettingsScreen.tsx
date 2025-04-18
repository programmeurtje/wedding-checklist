// app/(tabs)/SettingsScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { ASYNC_STORAGE_KEYS } from '../../constants/appConfig'; // Adjust path
import { isValidDateString } from '../../utils/dateUtils'; // Adjust path
import { MaterialIcons } from '@expo/vector-icons'; // For icon

export default function SettingsScreen() {
  const [weddingDate, setWeddingDate] = useState<Date | null>(null); // Store as Date object
  const [showPicker, setShowPicker] = useState(false); // Default hide picker on both platforms initially
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadWeddingDate = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedDateStr = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.WEDDING_DATE);
      if (isValidDateString(storedDateStr)) {
        setWeddingDate(new Date(storedDateStr!));
      } else {
        setWeddingDate(null);
      }
    } catch (error) {
      console.error('Failed to load wedding date', error);
      Alert.alert("Error", "Could not load settings.");
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeddingDate();
  }, [loadWeddingDate]);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Hide picker on Android regardless of action
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
     // iOS picker might stay open depending on 'display' mode,
     // but we only update state if a date was 'set'.

    if (event.type === 'set' && selectedDate) {
        if (selectedDate < new Date(new Date().setHours(0, 0, 0, 0))) {
            Alert.alert("Invalid Date", "Please select today or a future date.");
            // On Android, picker is already hidden. On iOS, user can pick again.
            return;
        }
        setWeddingDate(selectedDate);
    } else if (event.type === 'dismissed') {
        // User cancelled on Android, just hide picker (already done).
    }
     // If user cancels on some iOS display modes, we don't need to do anything here.
  };

  const saveWeddingDate = async () => {
    if (!weddingDate) {
        Alert.alert("No Date Selected", "Please select a wedding date first.");
        return;
    }
    if (weddingDate < new Date(new Date().setHours(0, 0, 0, 0))) {
       Alert.alert("Invalid Date", "Please select a future date before saving.");
       return;
     }

    try {
      setIsLoading(true); 
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.WEDDING_DATE, weddingDate.toISOString());
      setIsLoading(false);
      Alert.alert('Success', 'Wedding date saved! Your checklist dates will update when you go back.');
    } catch (error) {
      setIsLoading(false);
      console.error('Failed to save wedding date', error);
      Alert.alert("Error", "Could not save the wedding date.");
    }
  };

  // --- Reset Logic (confirmClearData, clearAppData) remains the same ---
   const confirmClearData = () => {
    Alert.alert(
      "Reset App Data",
      "Are you sure you want to clear all tasks and your saved wedding date? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset Data",
          style: "destructive",
          onPress: clearAppData,
        },
      ]
    );
  };

  const clearAppData = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.multiRemove([ASYNC_STORAGE_KEYS.WEDDING_DATE, ASYNC_STORAGE_KEYS.TASKS]);
      setWeddingDate(null);
      setIsLoading(false);
      Alert.alert('Data Cleared', 'All your data has been removed.');
    } catch (error) {
       setIsLoading(false);
      console.error('Failed to clear app data', error);
      Alert.alert("Error", "Could not clear app data.");
    }
  };
  // --- End Reset Logic ---

   if (isLoading && !showPicker) { // Show loading only if not interacting with picker
     return (
       <View style={styles.loadingContainer}>
         <ActivityIndicator size="large" color="#DA6F57" />
       </View>
     );
   }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.label}>Your Wedding Date:</Text>

      {/* --- Input Trigger --- */}
      {/* Button visible on both platforms to trigger the picker */}
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateDisplayButton}>
           <MaterialIcons name="calendar-today" size={20} color="#DA6F57" style={{ marginRight: 10 }}/>
           <Text style={styles.dateDisplayText}>
              {weddingDate ? format(weddingDate, 'MMMM dd, yyyy') : 'Select Date'}
          </Text>
      </TouchableOpacity>


      {/* --- DateTimePicker Component --- */}
      {/* Always mounted on iOS if display='inline', conditionally on Android */}
      {showPicker ? (
          <DateTimePicker
              testID="dateTimePicker"
              value={weddingDate || new Date()} // Use current date or default if null
              mode="date"
              // Use 'default' which is appropriate for settings screens
              // iOS: compact inline date picker
              // Android: opens system modal/spinner
              display="default"
              onChange={onDateChange}
              minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
              // No specific style needed for 'default' display usually
          />
      ): null}

      {/* --- Action Buttons --- */}
      {/* Add some space if the picker is not shown (especially iOS inline) */}
      <View style={{ marginTop: showPicker && Platform.OS === 'ios' ? 10 : 20 }}/>

      <TouchableOpacity
          style={[styles.actionButton, !weddingDate && styles.disabledButton]} // Disable save if no date
          onPress={saveWeddingDate}
          disabled={!weddingDate || isLoading}
       >
         {isLoading && !showPicker ? (
             <ActivityIndicator color="#FFF" />
          ) : (
             <Text style={styles.actionButtonText}>Save Wedding Date</Text>
         )}
      </TouchableOpacity>

       {/* Divider */}
       <View style={styles.divider} />

      {/* Clear Cache Button */}
       <Text style={styles.label}>App Data:</Text>
      <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={confirmClearData}
          disabled={isLoading} // Disable while loading/saving
      >
        <Text style={styles.actionButtonText}>Reset All App Data</Text>
      </TouchableOpacity>
       <Text style={styles.warningText}>This will remove all tasks and the wedding date.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF9F6',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 30 : 50,
        backgroundColor: '#FFF9F6',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 8,
        fontWeight: '500',
    },
    dateDisplayButton: { // The touchable area to trigger the picker
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        marginBottom: 10, // Space before picker appears or save button
    },
    dateDisplayText: {
        fontSize: 16,
        color: '#333', // Display selected date in normal text color
    },
    actionButton: {
        backgroundColor: '#DA6F57',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
        // marginTop handled dynamically above
        height: 50, // Fixed height for button consistency
        justifyContent: 'center', // Center activity indicator/text
    },
    disabledButton: {
      backgroundColor: '#E0A093', // Faded theme color
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 25,
    },
    clearButton: {
        backgroundColor: '#B71C1C', // Destructive red color
    },
    warningText: {
        fontSize: 12,
        color: '#757575',
        textAlign: 'center',
        marginTop: -10, // Pull up slightly below button
    }
});