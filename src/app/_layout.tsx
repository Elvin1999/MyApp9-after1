import AsyncStorage from "@react-native-async-storage/async-storage";

import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [name, setName] = useState<string>("");

  const [savedName, setSavedName] = useState<string>("");

  useEffect(() => {
    loadName();
  }, []);

  const loadName = async () => {
    const value = await AsyncStorage.getItem("username");
    if (value) {
      setSavedName(value);
    }
  };

  const saveName = async () => {
    if (name.trim().length == 0) {
      Alert.alert("Name field is required");
      return;
    }

    await AsyncStorage.setItem("username", name);
    setSavedName(name);
    setName("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome , {savedName || "user"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name."
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.btn} onPress={saveName}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  edit: {
    color: "#1566c0",
    fontWeight: 600,
  },
  delete: {
    color: "#1565c0",
    fontWeight: 600,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "springgreen",
  },
});
