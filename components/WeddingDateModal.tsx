import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

interface WeddingDateModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function WeddingDateModal({ visible, onClose }: WeddingDateModalProps) {
  const [weddingDate, setWeddingDate] = useState<Date | undefined>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const saveWeddingDate = async () => {
    try {
      if (weddingDate) {
        await AsyncStorage.setItem('weddingDate', weddingDate.toISOString());
        onClose();
      }
    } catch (error) {
      console.error('Failed to save wedding date', error);
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || weddingDate;
    setShowPicker(false);
    setWeddingDate(currentDate);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enter Your Wedding Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
            <Text style={styles.dateButtonText}>
              {weddingDate ? weddingDate.toDateString() : 'Select Date'}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={weddingDate || new Date()}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
          <TouchableOpacity style={styles.saveButton} onPress={saveWeddingDate}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateButton: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#DA6F57',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#DA6F57',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});