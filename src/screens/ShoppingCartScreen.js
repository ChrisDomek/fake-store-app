import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity } from "../redux/cartSlice";

import Header from "../components/Header";

export default function ShoppingCartScreen() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const totalItems = cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const totalCost = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Shopping Cart" />

      <View style={styles.container}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyText}>Your shopping cart is empty</Text>
        ) : (
          <View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>Total Items: {totalItems}</Text>
              <Text style={styles.summaryText}>
                Total Cost: ${totalCost.toFixed(2)}
              </Text>
            </View>

            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.quantityRow}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => dispatch(decreaseQuantity(item.id))}
                  >
                    <Text style={styles.quantityText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => dispatch(increaseQuantity(item.id))}
                  >
                    <Text style={styles.quantityText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
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
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
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
});
