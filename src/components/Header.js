import { View, Text, StyleSheet } from "react-native";
import { colors } from "../constants/theme";

export default function Header({ title }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.headerBackground,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000000",
    marginBottom: 15,
    marginTop: 10,
  },
  headerTitle: {
    color: colors.headerText,
    fontSize: 24,
    fontWeight: "bold",
  },
});
