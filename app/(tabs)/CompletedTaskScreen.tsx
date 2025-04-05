// app/(tabs)/CompletedTaskScreen.tsx
import React, { useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Alert, ActivityIndicator, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";

import { ASYNC_STORAGE_KEYS, Task } from "../../constants/appConfig"; // Adjust path

export default function CompletedTaskScreen() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Keep loadTasks async and wrapped in useCallback
  const loadTasks = useCallback(async () => {
    // console.log("CompletedScreen: Loading tasks..."); // Debug log
    setIsLoading(true);
    try {
      const storedTasks = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.TASKS);
      if (storedTasks) {
        setAllTasks(JSON.parse(storedTasks) as Task[]);
      } else {
        setAllTasks([]);
      }
    } catch (error) {
      console.error("CompletedScreen: Failed to load tasks", error);
      Alert.alert("Error", "Could not load tasks.");
      setAllTasks([]);
    } finally {
        setIsLoading(false);
        // console.log("CompletedScreen: Loading finished."); // Debug log
    }
  }, []); // No dependencies needed here if it only uses AsyncStorage

  // Correct way to use useFocusEffect with an async function
  useFocusEffect(
    useCallback(() => {
      // This synchronous function is the 'EffectCallback'
      // It runs when the screen gains focus.

      // Call your async function inside.
      loadTasks();

      // You can optionally return a cleanup function here if needed
      // This runs when the screen loses focus.
      // return () => {
      //   console.log("CompletedScreen lost focus");
      // };
    }, [loadTasks]) // Make sure loadTasks is a dependency
  );

  // Filter tasks in the component state (Memoized)
  const completedTasks = useMemo(() => {
      return allTasks.filter(task => task.completed);
  }, [allTasks]);

  // Function to mark a task as incomplete (move it back to checklist)
  const unCompleteTask = async (taskId: string) => {
    const updatedTasks = allTasks.map(task =>
        task.id === taskId ? { ...task, completed: false } : task
    );
    setAllTasks(updatedTasks); // Update local state first
    try {
        await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
         // console.log("Task marked incomplete:", taskId); // Debug log
    } catch (error) {
        console.error("Failed to uncomplete task", error);
        Alert.alert("Error", "Could not update task status.");
        loadTasks(); // Reload data on error to revert state
    }
  };

   // Optional: Function to permanently delete a completed task
   const deleteTask = (taskId: string) => {
       Alert.alert(
           "Delete Task",
           "Are you sure you want to permanently delete this completed task?",
           [
               { text: "Cancel", style: "cancel" },
               {
                   text: "Delete",
                   style: "destructive",
                   onPress: async () => {
                       const updatedTasks = allTasks.filter((task) => task.id !== taskId);
                       setAllTasks(updatedTasks); // Update UI
                       try {
                           await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
                           // console.log("Task deleted:", taskId); // Debug log
                       } catch (error) {
                           console.error("Failed to delete task", error);
                           Alert.alert("Error", "Could not delete task.");
                           loadTasks(); // Revert UI on error
                       }
                   },
               },
           ]
       );
   };

   // Render function remains the same...
   const renderCompletedTaskItem = ({ item }: { item: Task }) => {
      // ... (render logic as before)
      const handleLinkPress = () => {
           if (item.link) {
               Linking.openURL(item.link).catch(err => console.error("Couldn't load page", err));
           }
       };

       return (
           <View style={styles.taskCard}>
                <View style={styles.taskContent}>
                    <TouchableOpacity onPress={() => unCompleteTask(item.id)} style={styles.uncompleteButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        {/* Use check-box-outline or similar if you want it to look like it can be unchecked */}
                        <MaterialIcons name="check-box" size={24} color="#DA6F57" />
                    </TouchableOpacity>
                    <View style={styles.taskTextContainer}>
                        <Text style={styles.taskText}>{item.text}</Text>
                        {item.calculatedDate && <Text style={styles.detailText}>{item.calculatedDate}</Text>}
                        {item.link && (
                            <TouchableOpacity onPress={handleLinkPress} disabled={!item.link} style={styles.linkWrapper}>
                                <Text style={[styles.linkText, !item.link && styles.disabledLink]}>Inspire me!</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                     <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <MaterialIcons name="delete-outline" size={24} color="#AAA" />
                    </TouchableOpacity>
               </View>
           </View>
       );
   };

   // Loading and main return remain the same...
   if (isLoading) {
     return (
       <View style={styles.loadingContainer}>
         <ActivityIndicator size="large" color="#DA6F57" />
       </View>
     );
   }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Completed Tasks</Text>
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderCompletedTaskItem}
        ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks completed yet.</Text>
        }
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
}

// Styles remain the same...
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
        color: "#333", // Consistent title color
        marginBottom: 20,
        textAlign: 'center',
    },
    listContentContainer: {
        paddingBottom: 20,
    },
    taskCard: {
        backgroundColor: "#F5F5F5", // Greyed background
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
    linkWrapper: { // Wrap link text for potential touch handling/styling
      marginTop: 4,
    },
    linkText: {
        fontSize: 12,
        color: '#DA6F57', // Keep link color? Or dim?
        textDecorationLine: "line-through",
        opacity: 0.7, // Slightly faded link
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