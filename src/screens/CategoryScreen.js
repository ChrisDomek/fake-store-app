import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { getCategories } from "../services/api";

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
      <View>
        <ActivityIndicator size="large" />
        <Text>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Category Screen</Text>

      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => navigation.navigate("Products", { category })}
        >
          <Text>{category}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}