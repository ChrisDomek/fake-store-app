import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Button,
  StyleSheet,
  Image,
} from "react-native";
import { getProductsByCategory } from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import BackButton from "../components/BackButton";

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
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading products...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Products" />

      <ScrollView style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}>
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productButton}
            onPress={() =>
              navigation.navigate("Product Details", { productId: product.id })
            }
          >
            <View style={styles.productRow}>
              <Image source={{ uri: product.image }} style={styles.image} />

              <View style={styles.textContainer}>
                <Text style={styles.productText} numberOfLines={2}>
                  {product.title}
                </Text>

                <Text style={styles.price}>
                  <Text style={styles.priceLabel}>Price: </Text>${product.price}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BackButton
        onPress={() => navigation.goBack()}
        style={styles.backButtonContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderWidth: 2,
    borderColor: "#000000",
    borderRadius: 10,
    margin: 10,
    backgroundColor: "#fff",
    width: "90%",
    alignSelf: "center",
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
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#000000",
  },
  productText: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonContainer: {
    alignSelf: "center",
    margin: 20,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
    justifyContent: "space-between",
    height: 80,
  },
  price: {
    fontSize: 14,
  },
  priceLabel: {
    fontWeight: "bold",
  },
});
