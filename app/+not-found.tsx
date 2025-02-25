import { View, Text, StyleSheet } from "react-native";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Page not found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF9F6" },
  text: { fontSize: 20, color: "#DA6F57" },
});
