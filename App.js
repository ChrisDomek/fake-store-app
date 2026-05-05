import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import CategoryScreen from "./src/screens/CategoryScreen";
import ProductListScreen from "./src/screens/ProductListScreen";
import ProductDetails from "./src/screens/ProductDetails";
import ShoppingCartScreen from "./src/screens/ShoppingCartScreen";

import { Provider, useSelector } from "react-redux";
import { store } from "./src/redux/store";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ProductStack() {
  return (
    <Stack.Navigator
      initialRouteName="Categories"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Categories" component={CategoryScreen} />
      <Stack.Screen name="Products" component={ProductListScreen} />
      <Stack.Screen name="Product Details" component={ProductDetails} />
    </Stack.Navigator>
  );
}

function Tabs() {
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Products") {
            iconName = "home";
          } else if (route.name === "Shopping Cart") {
            iconName = "cart";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Products" component={ProductStack} />
      <Tab.Screen
        name="Shopping Cart"
        component={ShoppingCartScreen}
        options={{
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </Provider>
  );
}
