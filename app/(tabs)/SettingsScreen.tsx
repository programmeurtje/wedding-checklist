import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useRouter } from 'expo-router';

export default function SettingsScreen() {
  const [weddingDate, setWeddingDate] = useState('');

  useEffect(() => {
    loadWeddingDate();
  }, []);

  const loadWeddingDate = async () => {
    try {
      const storedDate = await AsyncStorage.getItem('weddingDate');
      if (storedDate) {
        setWeddingDate(storedDate);
      }
    } catch (error) {
      console.error('Failed to load wedding date', error);
    }
  };

  const saveWeddingDate = async () => {
    try {
      await AsyncStorage.setItem('weddingDate', weddingDate);
      alert('Wedding date saved');
    } catch (error) {
      console.error('Failed to save wedding date', error);
    }
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.clear();
      alert('Cache cleared!');
      setWeddingDate(''); // Clear the wedding date in the state as well
      
    } catch (error) {
      console.error('Failed to clear cache', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={weddingDate}
        onChangeText={setWeddingDate}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveWeddingDate}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.clearButton} onPress={clearCache}>
        <Text style={styles.clearButtonText}>Clear Cache</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF9F6' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#DA6F57',
    borderRadius: 10,
    backgroundColor: '#FFF',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#DA6F57',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  clearButton: {
    backgroundColor: '#DA6F57',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});