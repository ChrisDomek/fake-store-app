import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import CategoryScreen from "./src/screens/CategoryScreen";
import ProductListScreen from "./src/screens/ProductListScreen";
import ProductDetails from "./src/screens/ProductDetails";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Categories"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Categories" component={CategoryScreen} />
        <Stack.Screen name="Products" component={ProductListScreen} />
        <Stack.Screen name="Product Details" component={ProductDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
