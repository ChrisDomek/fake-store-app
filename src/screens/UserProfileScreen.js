import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOutUser, updateUser } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";
import { clearOrders } from "../redux/ordersSlice";
import { updateUserAPI } from "../services/authApi";

export default function UserProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedName, setUpdatedName] = useState(user?.name || "");
  const [updatedPassword, setUpdatedPassword] = useState("");

  function handleSignOut() {
    dispatch(signOutUser());
    dispatch(clearCart());
    dispatch(clearOrders());

    Alert.alert("Signed Out", "You have been signed out.");
  }

  async function handleUpdateConfirm() {
    if (!updatedName || !updatedPassword) {
      Alert.alert("Error", "Please enter a name and password.");
      return;
    }
    try {
      const response = await updateUserAPI(token, updatedName, updatedPassword);
      if (response.status !== "OK") {
        Alert.alert("Error", response.message || "Could not update profile.");
        return;
      }
      dispatch(updateUser({ name: updatedName }));
      setModalVisible(false);
      setUpdatedPassword("");

      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      Alert.alert("Error", "Profile update failed.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user?.name}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.signOutButton]}
        onPress={handleSignOut}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      {/* Modal for updating profile - add to component if i have time*/}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Update Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="New name"
              value={updatedName}
              onChangeText={setUpdatedName}
            />
            <TextInput
              style={styles.input}
              placeholder="New password"
              secureTextEntry
              value={updatedPassword}
              onChangeText={setUpdatedPassword}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleUpdateConfirm}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setUpdatedName(user?.name || "");
                  setUpdatedPassword("");
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  infoBox: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#000",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#429ffc",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  signOutButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
  },
  modalTitle: {
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
  },
  modalButton: {
    backgroundColor: "#429ffc",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
});
