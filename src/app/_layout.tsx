// import { Customer } from "@/models/customer.model";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { useEffect, useState } from "react";
// import {
//   Alert,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function App() {
//   const [name, setName] = useState<string>("");

//   const [savedName, setSavedName] = useState<string>("");

//   useEffect(() => {
//     loadName();
//   }, []);

//   const loadName = async () => {
//     const value = await AsyncStorage.getItem("username");
//     if (value) {
//       setSavedName(value);
//     }
//   };

//   const saveName = async () => {
//     if (name.trim().length == 0) {
//       Alert.alert("Name field is required");
//       return;
//     }

//     await AsyncStorage.setItem("username", name);
//     setSavedName(name);
//     setName("");
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome , {savedName || "user"}</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter your name."
//         value={name}
//         onChangeText={setName}
//       />

//       <TouchableOpacity style={styles.btn} onPress={saveName}>
//         <Text>Save</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

import { Customer } from "@/models/customer.model";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "customers";

export default function CustomerApp() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [editingId, setEditingId] = useState<string>("");

  const loadCustomers = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      setCustomers(JSON.parse(data));
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const saveCustomers = async (data: Customer[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setCustomers(data);
  };

  const handleAddOrUpdate = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (editingId !== "") {
      const updated = customers.map((c) =>
        c.id === editingId ? { ...c, name, email, phone } : c,
      );

      saveCustomers(updated);
      setEditingId("");
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: name,
        email: email,
        phone: phone,
      };

      saveCustomers([...customers, newCustomer]);
    }

    setName("");
    setEmail("");
    setPhone("");
  };

  const handleEdit = (customer: Customer) => {
    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
    setEditingId(customer.id.toString());
  };

  const handleDelete = (id: string) => {
    Alert.alert("Are you sure?", "This customer will delete!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const filtered = customers.filter((c) => c.id !== id);
          saveCustomers(filtered);
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: StatusBar.currentHeight }]}>
      <Text style={styles.title}>Customers Management App</Text>

      <TextInput
        style={styles.input}
        value={name}
        placeholder="Enter name"
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        value={email}
        placeholder="Enter email"
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        value={phone}
        placeholder="Enter phone"
        onChangeText={setPhone}
      />

      <Button
        title={editingId ? "Update" : "Add new"}
        onPress={handleAddOrUpdate}
      ></Button>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.email}</Text>
            <Text>{item.phone}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.edit}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
