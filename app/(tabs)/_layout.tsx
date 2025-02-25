import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Checklist",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="checklist" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="CompletedTaskScreen"
        options={{
          tabBarLabel: "Completed",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="done-all" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="SettingsScreen"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}