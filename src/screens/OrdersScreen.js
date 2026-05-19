import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { getProductDetails } from "../services/api";

export default function OrdersScreen() {
  const orders = useSelector((state) => state.orders.orders);
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

  function renderOrder({ item }) {
    const isExpanded = expandedOrderID === item.id;
    const parsedItems = JSON.parse(item.order_items);

    return (
      <View style={styles.orderCard}>
        <TouchableOpacity
          style={styles.orderHeader}
          onPress={() => toggleOrder(item.id, item.order_items)}
        >
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderTitle}>Order ID: {item.id}</Text>
            <Text style={styles.orderInfoText}>Items: {item.item_numbers}</Text>
            <Text style={styles.orderInfoText}>
              Total: ${(item.total_price / 100).toFixed(2)}
            </Text>
          </View>
          <Ionicons
            name={isExpanded ? "caret-up" : "caret-down"}
            size={24}
            color="black"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedSection}>
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
                  <View style={styles.productBottomRow}>
                    <Text>Price: ${product.price}</Text>
                    <Text>Quantity: {product.quantity}</Text>
                  </View>
                </View>
              </View>
            ))}
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
});
