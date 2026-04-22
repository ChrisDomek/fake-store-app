import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  StyleSheet,
} from "react-native";
import { getProductDetails } from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";

export default function ProductDetails({ route, navigation }) {
  const { productId } = route.params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProductData = async () => {
    try {
      const data = await getProductDetails(productId);
      setProduct(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading product details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Product Details" />

      <View style={styles.container}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.buttonSpacing}>
          <Button title="Back" onPress={() => navigation.goBack()} />
        </View>

        <Button title="Add to Shopping Cart" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonSpacing: {
    marginBottom: 10,
  },
});
