import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { taskService, AdminTask } from "../services/taskService";

interface AdminTasksModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AdminTasksModal: React.FC<AdminTasksModalProps> = ({
  visible,
  onClose,
}) => {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newTask, setNewTask] = useState<AdminTask>({
    text: "",
    relativeDueDate: { value: 0, unit: "percentage" },
  });

  // Helper function to sort tasks: percentage first, then days
  const sortTasks = (tasksToSort: AdminTask[]): AdminTask[] => {
    return tasksToSort.sort((a, b) => {
      // If both are same unit, sort by value
      if (a.relativeDueDate.unit === b.relativeDueDate.unit) {
        if (a.relativeDueDate.unit === "percentage") {
          // Percentage: low to high (0%, 5%, 10%, etc.)
          return a.relativeDueDate.value - b.relativeDueDate.value;
        } else {
          // Days: high to low (245 days, 238 days, 80 days, etc.)
          return b.relativeDueDate.value - a.relativeDueDate.value;
        }
      }
      // Percentage tasks come first
      if (a.relativeDueDate.unit === "percentage") return -1;
      if (b.relativeDueDate.unit === "percentage") return 1;
      return 0;
    });
  };

  useEffect(() => {
    if (visible && authenticated) {
      loadTasks();
    }
  }, [visible, authenticated]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const defaultTasks = await taskService.getDefaultTasks();
      setTasks(sortTasks(defaultTasks));
    } catch (error) {
      console.error("Error loading tasks:", error);
      Alert.alert("Error", "Kon taken niet laden");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const isValid = await taskService.verifyAdminPassword(password);
      if (isValid) {
        setAuthenticated(true);
        setPassword("");
      } else {
        Alert.alert("Error", "Incorrect wachtwoord");
      }
    } catch (error) {
      Alert.alert("Error", "Kon niet inloggen");
    } finally {
      setLoading(false);
    }
  };

  const saveTasks = async (updatedTasks: AdminTask[]) => {
    setLoading(true);
    try {
      await taskService.updateDefaultTasks(updatedTasks, "girlsofhonour2024");
      // Sort tasks after saving using the sortTasks helper
      const sortedTasks = sortTasks(updatedTasks);
      setTasks(sortedTasks);
      Alert.alert("Succes", "Taken zijn bijgewerkt voor alle gebruikers");
    } catch (error) {
      console.error("Error saving tasks:", error);
      Alert.alert("Error", "Kon taken niet opslaan");
    } finally {
      setLoading(false);
    }
  };

  const addTask = (taskToAdd: AdminTask) => {
    console.log("Adding task:", taskToAdd); // Debug log
    if (!taskToAdd.text.trim()) {
      Alert.alert("Error", "Voer een taak beschrijving in");
      return;
    }

    const updatedTasks = [...tasks, { ...taskToAdd }];
    saveTasks(updatedTasks);
    setNewTask({
      text: "",
      relativeDueDate: { value: 0, unit: "percentage" },
    });
  };

  const updateTask = (index: number, updatedTask: AdminTask) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = updatedTask;
    saveTasks(updatedTasks);
    setEditingIndex(null);
  };

  const deleteTask = (index: number) => {
    Alert.alert(
      "Taak verwijderen",
      "Weet je zeker dat je deze taak wilt verwijderen?",
      [
        { text: "Annuleren", style: "cancel" },
        {
          text: "Verwijderen",
          style: "destructive",
          onPress: () => {
            const updatedTasks = tasks.filter((_, i) => i !== index);
            saveTasks(updatedTasks);
          },
        },
      ]
    );
  };

  const resetToDefaults = () => {
    Alert.alert(
      "Reset naar standaard",
      "Dit zal alle aangepaste taken vervangen door de standaard taken. Weet je het zeker?",
      [
        { text: "Annuleren", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            // Reset to fallback tasks
            const fallbackTasks = await taskService.getDefaultTasks();
            await saveTasks(fallbackTasks);
          },
        },
      ]
    );
  };

  const handleClose = () => {
    setAuthenticated(false);
    setPassword("");
    setEditingIndex(null);
    onClose();
  };

  const TaskEditor = ({
    task,
    onSave,
    onCancel,
  }: {
    task: AdminTask;
    onSave: (task: AdminTask) => void;
    onCancel: () => void;
  }) => {
    const [editTask, setEditTask] = useState<AdminTask>(task);

    // Update local state when task prop changes
    useEffect(() => {
      setEditTask(task);
    }, [task]);

    return (
      <View style={styles.taskEditor}>
        <TextInput
          style={styles.textInput}
          value={editTask.text}
          onChangeText={(text) => setEditTask({ ...editTask, text })}
          placeholder="Taak beschrijving"
          multiline
        />

        <View style={styles.row}>
          <Text>Timing: </Text>
          <TextInput
            style={styles.numberInput}
            value={editTask.relativeDueDate.value.toString()}
            onChangeText={(value) =>
              setEditTask({
                ...editTask,
                relativeDueDate: {
                  ...editTask.relativeDueDate,
                  value: parseInt(value) || 0,
                },
              })
            }
            keyboardType="numeric"
          />
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                editTask.relativeDueDate.unit === "percentage" &&
                  styles.unitButtonActive,
              ]}
              onPress={() =>
                setEditTask({
                  ...editTask,
                  relativeDueDate: {
                    ...editTask.relativeDueDate,
                    unit: "percentage",
                  },
                })
              }
            >
              <Text
                style={[
                  styles.unitButtonText,
                  editTask.relativeDueDate.unit === "percentage" &&
                    styles.unitButtonTextActive,
                ]}
              >
                %
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                editTask.relativeDueDate.unit === "days" &&
                  styles.unitButtonActive,
              ]}
              onPress={() =>
                setEditTask({
                  ...editTask,
                  relativeDueDate: {
                    ...editTask.relativeDueDate,
                    unit: "days",
                  },
                })
              }
            >
              <Text
                style={[
                  styles.unitButtonText,
                  editTask.relativeDueDate.unit === "days" &&
                    styles.unitButtonTextActive,
                ]}
              >
                dagen
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.textInput}
          value={editTask.link || ""}
          onChangeText={(link) =>
            setEditTask({ ...editTask, link: link || undefined })
          }
          placeholder="Link (optioneel)"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              console.log("TaskEditor saving:", editTask); // Debug log
              onSave(editTask);
            }}
          >
            <Text style={styles.buttonText}>Opslaan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.buttonText}>Annuleren</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Login screen
  if (!authenticated) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Admin Login</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Sluiten</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginLabel}>Admin Wachtwoord:</Text>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Voer admin wachtwoord in"
              secureTextEntry
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Inloggen</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // Main admin interface
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Beheer Default Taken</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Sluiten</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Bezig met opslaan...</Text>
          </View>
        )}

        <ScrollView style={styles.content}>
          {/* Add new task */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nieuwe taak toevoegen</Text>
            <View style={styles.taskEditor}>
              <TextInput
                style={styles.textInput}
                value={newTask.text}
                onChangeText={(text) => setNewTask({ ...newTask, text })}
                placeholder="Taak beschrijving"
                multiline
              />

              <View style={styles.row}>
                <Text>Timing: </Text>
                <TextInput
                  style={styles.numberInput}
                  value={newTask.relativeDueDate.value.toString()}
                  onChangeText={(value) =>
                    setNewTask({
                      ...newTask,
                      relativeDueDate: {
                        ...newTask.relativeDueDate,
                        value: parseInt(value) || 0,
                      },
                    })
                  }
                  keyboardType="numeric"
                />
                <View style={styles.unitSelector}>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      newTask.relativeDueDate.unit === "percentage" &&
                        styles.unitButtonActive,
                    ]}
                    onPress={() =>
                      setNewTask({
                        ...newTask,
                        relativeDueDate: {
                          ...newTask.relativeDueDate,
                          unit: "percentage",
                        },
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        newTask.relativeDueDate.unit === "percentage" &&
                          styles.unitButtonTextActive,
                      ]}
                    >
                      %
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.unitButton,
                      newTask.relativeDueDate.unit === "days" &&
                        styles.unitButtonActive,
                    ]}
                    onPress={() =>
                      setNewTask({
                        ...newTask,
                        relativeDueDate: {
                          ...newTask.relativeDueDate,
                          unit: "days",
                        },
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.unitButtonText,
                        newTask.relativeDueDate.unit === "days" &&
                          styles.unitButtonTextActive,
                      ]}
                    >
                      dagen
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TextInput
                style={styles.textInput}
                value={newTask.link || ""}
                onChangeText={(link) =>
                  setNewTask({ ...newTask, link: link || undefined })
                }
                placeholder="Link (optioneel)"
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    console.log("Adding new task:", newTask); // Debug log
                    addTask(newTask);
                  }}
                >
                  <Text style={styles.buttonText}>Toevoegen</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() =>
                    setNewTask({
                      text: "",
                      relativeDueDate: { value: 0, unit: "percentage" },
                    })
                  }
                >
                  <Text style={styles.buttonText}>Wissen</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Existing tasks */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Bestaande taken ({tasks.length})
              </Text>
              <TouchableOpacity
                onPress={resetToDefaults}
                style={styles.resetButton}
              >
                <Text style={styles.resetButtonText}>Reset naar standaard</Text>
              </TouchableOpacity>
            </View>

            {tasks.map((task, index) => (
              <View key={index} style={styles.taskItem}>
                {editingIndex === index ? (
                  <TaskEditor
                    task={task}
                    onSave={(updatedTask) => updateTask(index, updatedTask)}
                    onCancel={() => setEditingIndex(null)}
                  />
                ) : (
                  <View>
                    <Text style={styles.taskText}>{task.text}</Text>
                    <Text style={styles.taskMeta}>
                      {task.relativeDueDate.value}{" "}
                      {task.relativeDueDate.unit === "percentage"
                        ? "%"
                        : "dagen"}
                      {task.link && " • Heeft link"}
                    </Text>
                    <View style={styles.taskActions}>
                      <TouchableOpacity
                        onPress={() => setEditingIndex(index)}
                        style={styles.editButton}
                      >
                        <Text style={styles.actionButtonText}>Bewerken</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteTask(index)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.actionButtonText}>Verwijderen</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 40,
  },
  loginLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "500",
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  resetButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  taskEditor: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    minHeight: 40,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    width: 60,
    textAlign: "center",
    marginHorizontal: 10,
  },
  unitSelector: {
    flexDirection: "row",
  },
  unitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 2,
    borderRadius: 4,
  },
  unitButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  unitButtonText: {
    fontSize: 12,
    color: "#333",
  },
  unitButtonTextActive: {
    color: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#34C759",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#8E8E93",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  taskItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 5,
  },
  taskMeta: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
  },
  taskActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
  },
});
