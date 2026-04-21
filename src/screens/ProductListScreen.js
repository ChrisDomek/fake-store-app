import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Button } from "react-native";

export default function ProductListScreen({ route, navigation }) {
  const { category } = route.params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      const response = await fetch(
        `https://fakestoreapi.com/products/category/${category}`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Text>Product List Screen</Text>
      <Text>Category: {category}</Text>
      <Button title="Back" onPress={() => navigation.goBack()} />

      {products.map((product) => (
        <TouchableOpacity
          key={product.id}
          onPress={() =>
            navigation.navigate("Product Details", { productId: product.id })
          }
        >
          <Text>{product.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}