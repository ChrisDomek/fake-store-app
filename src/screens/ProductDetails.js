import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";

export default function ProductDetails({ route, navigation }) {
  const { productId } = route.params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProductDetails = async () => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.log("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
        <Text>Loading product details...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>{product.title}</Text>
      <Text>${product.price}</Text>
      <Text>{product.description}</Text>

      <Button title="Back" onPress={() => navigation.goBack()} />
      <Button title="Add to Shopping Cart" onPress={() => {}} />
    </View>
  );
}