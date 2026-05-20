import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

import { useDispatch } from "react-redux";
import { signInUser } from "../redux/authSlice";
import { signInUserAPI, signUpUserAPI } from "../services/authApi";
import { getCartAPI } from "../services/cartApi";
import { setCart } from "../redux/cartSlice";
import { getOrdersAPI } from "../services/orderApi";
import { setOrders } from "../redux/ordersSlice";

export default function AuthScreen() {
  const dispatch = useDispatch();

  const [isSignUp, setIsSignUp] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function clearFields() {
    setName("");
    setEmail("");
    setPassword("");
  }

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (isSignUp && !name) {
      Alert.alert("Error", "Please enter your name.");
      return;
    }

    try {
      let data;

      if (isSignUp) {
        data = await signUpUserAPI(name, email, password);
      } else {
        data = await signInUserAPI(email, password);
      }

      if (data.error || data.message?.toLowerCase().includes("error")) {
        Alert.alert("Error", data.message || "Something went wrong.");
        return;
      }

      if (!data.token || !data.id || !data.email) {
        Alert.alert("Error", data.message || "Invalid server response.");
        return;
      }

      dispatch(signInUser(data));

      try {
        const cartData = await getCartAPI(data.token);
        // console.log("CART RESPONSE:", cartData);
        if (cartData.items) {
          dispatch(setCart(cartData.items));
        }
      } catch (cartError) {
        //console.log("Cart fetch failed:", cartError);
        dispatch(setCart([]));
      }
      try {
        const ordersData = await getOrdersAPI(data.token);
        if (ordersData.orders) {
          dispatch(setOrders(ordersData.orders));
        }
      } catch (ordersError) {
        dispatch(setOrders([]));
      }

      Alert.alert(
        "Success",
        isSignUp ? "Account created successfully." : "Signed in successfully.",
      );

      clearFields();
    } catch (error) {
      Alert.alert(
        "Connection Error",
        "Could not connect to the Fake Store API Server.",
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignUp
          ? "Sign up a new user"
          : "Sign in with your email and password"}
      </Text>
      {isSignUp && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={clearFields}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.toggleText}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#429ffc",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toggleText: {
    textAlign: "center",
    color: "#429ffc",
    fontWeight: "bold",
  },
});
