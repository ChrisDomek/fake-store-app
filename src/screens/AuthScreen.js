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

  function handleSubmit() {

    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (isSignUp && !name) {
      Alert.alert("Error", "Please enter your name.");
      return;
    }

    const fakeUser = {
      id: 1,
      name: name || "Test User",
      email,
    };

    dispatch(signInUser(fakeUser));
    Alert.alert(
      "Success",
      isSignUp ? "Account created." : "Signed in successfully.",
    );
    clearFields();
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
