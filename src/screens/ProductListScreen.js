import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Button, StyleSheet } from "react-native";
import { getProductsByCategory } from "../services/api";

export default function ProductListScreen({ route, navigation }) {
  const { category } = route.params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

const getProductsData = async () => {
  try {
    const data = await getProductsByCategory(category);
    setProducts(data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getProductsData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Product List Screen</Text>
      <Text style={styles.subtitle}>Category: {category}</Text>
      <Button title="Back" onPress={() => navigation.goBack()} />

      {products.map((product) => (
        <TouchableOpacity
          key={product.id}
          style={styles.productButton}
          onPress={() =>
            navigation.navigate("Product Details", { productId: product.id })
          }
        >
          <Text style={styles.productText}>{product.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 10,
  },
  productButton: {
    padding: 15,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 12,
  },
  productText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});