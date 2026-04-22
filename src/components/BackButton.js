import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BackButton({ onPress, style }) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <View style={styles.content}>
        <Ionicons name="arrow-back" size={20} color="white" />
        <Text style={styles.text}>Back</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#429ffc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#000000",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});