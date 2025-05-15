import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Alert, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { ASYNC_STORAGE_KEYS, Task } from '../../constants/appConfig';

export default function CompletedTaskScreen() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedTasks = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.TASKS);
      setAllTasks(storedTasks ? JSON.parse(storedTasks) : []);
    } catch (error) {
      console.error('CompletedScreen: Failed to load tasks', error);
      Alert.alert('Fout', 'Taken konden niet geladen worden.');
      setAllTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const completedTasks = useMemo(() => allTasks.filter(task => task.completed), [allTasks]);

  const unCompleteTask = async (taskId: string) => {
    const updated = allTasks.map(t => t.id === taskId ? { ...t, completed: false } : t);
    setAllTasks(updated);
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.TASKS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to uncomplete task', error);
      Alert.alert('Fout', 'Kon taakstatus niet bijwerken.');
      loadTasks();
    }
  };

  const deleteTask = (taskId: string) => {
    Alert.alert(
      'Taak verwijderen',
      'Weet je zeker dat je deze voltooide taak permanent wilt verwijderen?',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Verwijderen',
          style: 'destructive',
          onPress: async () => {
            const filtered = allTasks.filter(t => t.id !== taskId);
            setAllTasks(filtered);
            try {
              await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.TASKS, JSON.stringify(filtered));
            } catch (error) {
              console.error('Failed to delete task', error);
              Alert.alert('Fout', 'Kon taak niet verwijderen.');
              loadTasks();
            }
          },
        },
      ]
    );
  };

  const renderCompletedTaskItem = ({ item }: { item: Task }) => {
    const handleLinkPress = () => {
      if (item.link) {
        Linking.openURL(item.link).catch(err => console.error("Couldn't load page", err));
      }
    };

    return (
      <View style={styles.taskCard}>
        <View style={styles.taskContent}>
          <TouchableOpacity onPress={() => unCompleteTask(item.id)} style={styles.uncompleteButton}>
            <MaterialIcons name="check-box" size={24} color="#DA6F57" />
          </TouchableOpacity>
          <View style={styles.taskTextContainer}>
            <Text style={styles.taskText}>{item.text}</Text>
            {item.calculatedDate && <Text style={styles.detailText}>{item.calculatedDate}</Text>}
            {item.link && (
              <TouchableOpacity onPress={handleLinkPress} style={styles.linkWrapper}>
                <Text style={styles.linkText}>Inspireer me!</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
            <MaterialIcons name="delete-outline" size={24} color="#AAA" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DA6F57" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voltooide taken</Text>
      <FlatList
        data={completedTasks}
        keyExtractor={item => item.id}
        renderItem={renderCompletedTaskItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Nog geen taken voltooid.</Text>}
        contentContainerStyle={styles.listContentContainer}
      />
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
        backgroundColor: "#FFF9F6",
        paddingHorizontal: 15,
        paddingTop: Platform.OS === 'android' ? 30 : 50,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        textAlign: 'center',
    },
    listContentContainer: {
        paddingBottom: 20,
    },
    taskCard: {
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        marginBottom: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    taskContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
    },
    uncompleteButton: {
       marginRight: 12,
       padding: 5, // Hit area increase
    },
    taskTextContainer: {
       flex: 1, // Take available space
       marginRight: 10, // Add some space before delete icon
    },
    taskText: {
        fontSize: 16,
        color: "#888", // Dimmed text
        textDecorationLine: "line-through",
        marginBottom: 2, // Space before details
    },
    detailText: {
        fontSize: 12,
        color: '#AAA',
        textDecorationLine: "line-through",
        marginTop: 2,
    },
    linkWrapper: {
      marginTop: 4,
    },
    linkText: {
        fontSize: 12,
        color: '#DA6F57', 
        textDecorationLine: "line-through",
        opacity: 0.7, 
    },
    disabledLink: {
       opacity: 0.4,
    },
    deleteButton: {
       marginLeft: 'auto', // Push delete to the far right
       padding: 5, // Hit area increase
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
        color: "#888",
    },
});