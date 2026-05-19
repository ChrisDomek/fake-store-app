import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../redux/cartSlice";
import { setOrders } from "../redux/ordersSlice";
import { createOrderAPI, getOrdersAPI } from "../services/orderApi";
import { updateCartAPI } from "../services/cartApi";
import { Ionicons } from "@expo/vector-icons";
import Header from "../components/Header";

export default function ShoppingCartScreen() {
  const cartItems = useSelector((state) => state.cart.items);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const totalItems = cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const totalCost = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  async function handleCheckout() {
    try {
      const response = await createOrderAPI(token, cartItems);
      if (response.status !== "OK") {
        Alert.alert("Error", "Could not create order.");
        return;
      }

      const ordersData = await getOrdersAPI(token);
      console.log("ORDERS RESPONSE:", ordersData);
      if (ordersData.orders) {
        dispatch(setOrders(ordersData.orders));
      }

      dispatch(clearCart());
      await updateCartAPI(token, []);
      Alert.alert("Success", "Order created successfully.");
    } catch (error) {
      Alert.alert("Error", "Checkout failed.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Shopping Cart" />
      <View style={styles.container}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your shopping cart is empty!</Text>
          </View>
        ) : (
          <View style={styles.cartContent}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>Total Items: {totalItems}</Text>
              <Text style={styles.summaryText}>
                Total Cost: ${totalCost.toFixed(2)}
              </Text>
            </View>
            <FlatList
              style={styles.cartList}
              data={cartItems}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.cartListContent}
              renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <View style={styles.itemRow}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text>
                        Price: ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                      <View style={styles.quantityRow}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => dispatch(decreaseQuantity(item.id))}
                        >
                          <Text style={styles.quantityText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>
                          Qty: {item.quantity}
                        </Text>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => dispatch(increaseQuantity(item.id))}
                        >
                          <Text style={styles.quantityText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        )}
      </View>
      {cartItems.length > 0 && (
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <View style={styles.checkoutContent}>
            <Ionicons name="bag-check" size={22} color="white" />
            <Text style={styles.checkoutText}>Checkout</Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "90%",
    alignSelf: "center",
    padding: 20,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  emptyText: {
    fontSize: 28,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cartItem: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  quantityButton: {
    backgroundColor: "#429ffc",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#000",
  },
  quantityText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
  },
  summaryBox: {
    backgroundColor: "#429ffc",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  summaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cartListContent: {
    paddingBottom: 80,
  },
  cartContent: {
    flex: 1,
  },
  cartList: {
    //maxHeight: "75%",
    flex: 1,
  },
  itemRow: {
    flexDirection: "row",
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  itemInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  checkoutButton: {
    backgroundColor: "#429ffc",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
    width: "50%",
    marginTop: 20,
    alignSelf: "center",
  },
  checkoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
