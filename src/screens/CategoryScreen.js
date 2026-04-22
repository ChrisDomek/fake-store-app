import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { colors } from "../constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCategories } from "../services/api";
import Header from "../components/Header";

export default function CategoryScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategoriesData = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategoriesData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.SafeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Categories" />

      <View style={styles.container}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.categoryButton}
            onPress={() => navigation.navigate("Products", { category })}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  header: {
    backgroundColor: colors.headerBackground,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: colors.headerText,
    fontSize: 24,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  categoryButton: {
    padding: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 16,
    textTransform: "capitalize",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
