import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ShortPlanningModalProps {
  visible: boolean;
  onClose: () => void;
  blogUrl?: string;
}

export default function ShortPlanningModal({
  visible,
  onClose,
  blogUrl = "https://your-blog-url.com/trouwen-in-6-maanden", // Replace with your actual blog URL
}: ShortPlanningModalProps) {
  const handleBlogPress = async () => {
    try {
      await Linking.openURL(blogUrl);
    } catch (error) {
      Alert.alert(
        "Fout",
        "Kon de blog niet openen. Probeer het later opnieuw."
      );
    }
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
          {/* Header with icon */}
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="schedule" size={32} color="#DA6F57" />
            </View>
            <Text style={styles.modalTitle}>Korte Planning Gedetecteerd!</Text>
          </View>

          <Text style={styles.modalText}>
            Jouw bruiloft is binnen 6 maanden! 🎉{"\n\n"}
            Geen paniek - het is nog steeds mogelijk om een prachtige bruiloft 
            te organiseren. Ontdek onze tips en trucs voor een perfecte 
            planning op korte termijn.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonBlog]}
              onPress={handleBlogPress}
            >
              <MaterialIcons 
                name="lightbulb-outline" 
                size={20} 
                color="#FFFFFF" 
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonTextBlog}>
                Lees: "Trouwen in 6 maanden"
              </Text>
              <MaterialIcons 
                name="arrow-forward" 
                size={18} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={onClose}
            >
              <Text style={styles.buttonTextClose}>Later</Text>
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
    maxWidth: 400,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    backgroundColor: "#F9EAE5",
    borderRadius: 30,
    padding: 15,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 25,
    textAlign: "center",
    color: "#555",
    fontSize: 16,
    lineHeight: 22,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonBlog: {
    backgroundColor: "#DA6F57",
  },
  buttonClose: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#DA6F57",
    elevation: 0,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonTextBlog: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
    flex: 1,
  },
  buttonTextClose: {
    color: "#DA6F57",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});