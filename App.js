import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import CategoryScreen from "./src/screens/CategoryScreen";
import ProductListScreen from "./src/screens/ProductListScreen";
import ProductDetails from "./src/screens/ProductDetails";
import ShoppingCartScreen from "./src/screens/ShoppingCartScreen";
import AuthScreen from "./src/screens/AuthScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import SplashScreen from "./src/screens/SplashScreen";

import { Provider, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { store } from "./src/redux/store";
import { Alert } from "react-native";

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
  const user = useSelector((state) => state.auth.user);
  const totalItems = cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
  function protectedTabPress(e) {
    if (!user) {
      e.preventDefault();
      Alert.alert("Not Logged in", "You must be logged in to access this tab.");
    }
  }

  return (
    <Tab.Navigator
      initialRouteName="Account"
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
      <Tab.Screen
        name="Products"
        component={ProductStack}
        listeners={{
          tabPress: protectedTabPress,
        }}
      />
      <Tab.Screen
        name="Shopping Cart"
        component={ShoppingCartScreen}
        listeners={{
          tabPress: protectedTabPress,
        }}
        options={{
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
        }}
      />
      <Tab.Screen
        name="Account"
        component={user ? UserProfileScreen : AuthScreen}
        options={{
          tabBarLabel: user ? "Profile" : "Sign In",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={user ? "person" : "log-in"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        {showSplash ? <SplashScreen /> : <Tabs />}
      </NavigationContainer>
    </Provider>
  );
}
