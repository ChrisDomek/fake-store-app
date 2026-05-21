import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { getProductDetails } from "../services/api";
import { setOrders } from "../redux/ordersSlice";
import { getOrdersAPI, updateOrderAPI } from "../services/orderApi";

export default function OrdersScreen() {
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const [expandedOrderID, setExpandedOrderID] = useState(null);
  const [expandedSection, setExpandedSection] = useState("New Orders");
  const [orderProductDetails, setOrderProductDetails] = useState({});

  async function toggleOrder(orderID, orderItems) {
    if (expandedOrderID === orderID) {
      setExpandedOrderID(null);
      return;
    }
    setExpandedOrderID(orderID);
    if (orderProductDetails[orderID]) {
      return;
    }
    try {
      const parsedItems = JSON.parse(orderItems);

      const productDetails = await Promise.all(
        parsedItems.map(async (item) => {
          const details = await getProductDetails(item.productID);
          return {
            ...item,
            title: details.title,
            image: details.image,
          };
        }),
      );

      setOrderProductDetails((prevDetails) => ({
        ...prevDetails,
        [orderID]: productDetails,
      }));
    } catch (error) {
      console.log("Could not load order product details:", error);
    }
  }

  function toggleSection(sectionTitle) {
    if (expandedSection === sectionTitle) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionTitle);
    }
  }

  const newOrders = orders.filter(
    (order) => order.is_paid === 0 && order.is_delivered === 0,
  );

  const paidOrders = orders.filter(
    (order) => order.is_paid === 1 && order.is_delivered === 0,
  );

  const deliveredOrders = orders.filter(
    (order) => order.is_paid === 1 && order.is_delivered === 1,
  );

  async function handleUpdateOrder(orderID, isPaid, isDelivered) {
    try {
      const response = await updateOrderAPI(
        token,
        orderID,
        isPaid,
        isDelivered,
      );
      if (response.status !== "OK") {
        Alert.alert("Error", "Could not update order.");
        return;
      }
      const ordersData = await getOrdersAPI(token);
      if (ordersData.orders) {
        dispatch(setOrders(ordersData.orders));
      }
      if (isPaid && !isDelivered) {
        Alert.alert("Success", "Payment received.");
      }
      if (isPaid && isDelivered) {
        Alert.alert("Success", "Order received.");
      }
    } catch (error) {
      Alert.alert("Error", "Order update failed.");
    }
  }

  function renderOrder({ item }) {
    const isExpanded = expandedOrderID === item.id;
    const parsedItems = JSON.parse(item.order_items);

    return (
      <View style={styles.orderCard}>
        <TouchableOpacity
          style={styles.orderHeader}
          onPress={() => toggleOrder(item.id, item.order_items)}
        >
          <View style={styles.orderInfoContainer}>
            <View style={styles.orderInfoBox}>
              <Text style={styles.orderLabel}>Order ID</Text>
              <Text style={styles.orderValue}>#{item.id}</Text>
            </View>
            <View style={styles.orderInfoBox}>
              <Text style={styles.orderLabel}>Items</Text>
              <Text style={styles.orderValue}>{item.item_numbers}</Text>
            </View>
            <View style={styles.orderInfoBox}>
              <Text style={styles.orderLabel}>Total</Text>
              <Text style={styles.orderValue}>
                ${(item.total_price / 100).toFixed(2)}
              </Text>
            </View>
          </View>
          <Ionicons
            name={isExpanded ? "caret-up" : "caret-down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>

        {/* Expanded order section */}
        {isExpanded && (
          <View style={styles.expandedSection}>
            {/* Render every product inside the order */}
            {(orderProductDetails[item.id] || []).map((product, index) => (
              <View key={index} style={styles.expandedItem}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={2}>
                    {product.title}
                  </Text>
                  {/* Bottom row with price + quantity */}
                  <View style={styles.productBottomRow}>
                    <Text>Price: ${product.price}</Text>
                    <Text>Quantity: {product.quantity}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Pay button */}
            {item.is_paid === 0 && item.is_delivered === 0 && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleUpdateOrder(item.id, true, false)}
              >
                <Text style={styles.actionButtonText}>Pay</Text>
              </TouchableOpacity>
            )}
            {/* Receive button */}
            {item.is_paid === 1 && item.is_delivered === 0 && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleUpdateOrder(item.id, true, true)}
              >
                <Text style={styles.actionButtonText}>Receive</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  }

  function renderSection(title, data) {
    const isSectionExpanded = expandedSection === title;

    return (
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(title)}
        >
          <Text style={styles.sectionTitle}>
            {title}: {data.length}
          </Text>
          <Ionicons
            name={isSectionExpanded ? "caret-up" : "caret-down"}
            size={22}
            color="black"
          />
        </TouchableOpacity>
        {isSectionExpanded &&
          (data.length === 0 ? (
            <Text style={styles.emptyText}>No orders</Text>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderOrder}
            />
          ))}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="My Orders" />
      <View style={styles.container}>
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You have no orders yet.</Text>
          </View>
        ) : (
          <>
            {renderSection("New Orders", newOrders)}
            {renderSection("Paid Orders", paidOrders)}
            {renderSection("Delivered Orders", deliveredOrders)}
          </>
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
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderCard: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  orderTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expandedItem: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4aa3cf",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  productImage: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  orderInfoText: {
    fontSize: 14,
    marginBottom: 20,
  },
  orderInfoContainer: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  orderInfoBox: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  orderLabel: {
    fontSize: 12,
    color: "#555",
  },
  orderValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  actionButton: {
    backgroundColor: "#429ffc",
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    marginTop: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
