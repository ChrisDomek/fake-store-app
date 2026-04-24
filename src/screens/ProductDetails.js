import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { getProductDetails } from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import BackButton from "../components/BackButton";
import { Ionicons } from "@expo/vector-icons";

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
        <Image source={{ uri: product.image }} style={styles.image} />
        <Text style={styles.title}>{product.title}</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Rate: </Text>
            {product.rating.rate}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Count: </Text>
            {product.rating.count}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Price: </Text>${product.price}
          </Text>
        </View>
        <View style={styles.buttonRow}>
          <BackButton onPress={() => navigation.goBack()} />
          <TouchableOpacity style={styles.cartButton}>
            <View style={styles.cartContent}>
              <Ionicons name="cart" size={20} color="white" />
              <Text style={styles.cartText}>Add to Cart</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.descriptionTitle}>Description:</Text>
        <View style={styles.descriptionBox}>
          <Text style={styles.description}>{product.description}</Text>
        </View>
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
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  infoBox: {
    backgroundColor: "#4aa3cf",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  infoText: {
    fontSize: 14,
  },
  bold: {
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  descriptionBox: {
    backgroundColor: "#e0e0e0",
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 8,
    padding: 10,
  },
  cartButton: {
    backgroundColor: "#429ffc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#000000",
  },
  cartText: {
    color: "white",
    fontSize: 16,
  },
  cartContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
