// App.js

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Notification from "./Notification";
import WashingMachineButton from "./MachineButton";
import { checkMachineAvailability } from "./Services/DatabaseService";

// Home screen component
const HomeScreen = ({ navigation, showNotification }) => {
  const [machineAvailable, setMachineAvailable] = useState(null);

  // Function to fetch machine data
  const fetchMachineData = async () => {
    try {
      const machineAvailable = await checkMachineAvailability();
      setMachineAvailable(machineAvailable);

      if (machineAvailable !== "running") {
        showNotification(true);
      } else {
        showNotification(false);
      }

      if (machineAvailable !== "running") {
        setTimeout(fetchMachineData, 15 * 60 * 1000);
      }
    } catch (error) {
      console.error("Error fetching machine data:", error);
    }
  };

  // Handler for user button press
  const handleUserButtonPress = () => {
    console.log("User button pressed");
    navigation.navigate("RequestMachine");
  };

  // Handler for admin button press
  const handleAdminButtonPress = () => {
    console.log("Admin button pressed");
    navigation.navigate("Maintenance");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.additionalText}>
        {machineAvailable === false &&
          "Washing machine is currently not available. Please wait."}
      </Text>
      <WashingMachineButton onPress={fetchMachineData} />
      <Notification show={showNotification} />
      <TouchableOpacity style={styles.button} onPress={handleUserButtonPress}>
        <Text style={styles.buttonText}>User</Text>
      </TouchableOpacity>
      <View style={{ height: 10 }} />
      <TouchableOpacity style={styles.button} onPress={handleAdminButtonPress}>
        <Text style={styles.buttonText}>Admin</Text>
      </TouchableOpacity>
    </View>
  );
};

// Request machine screen component
const RequestMachineScreen = ({ showNotification }) => {
  const handleRequestWashingMachine = async () => {
    try {
      // Your logic for handling request washing machine
      // For demo purposes, let's simulate a successful request by showing the notification
      showNotification(true);
    } catch (error) {
      console.error("Error handling request:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.requestButton}
        onPress={handleRequestWashingMachine}
      >
        <Text style={styles.buttonText}>Request Washing Machine</Text>
      </TouchableOpacity>
    </View>
  );
};

// Maintenance screen component
const MaintenanceScreen = () => {
  const handleMaintenanceButtonPress = () => {
    // Logic for handling maintenance button press
    console.log("Maintenance button pressed");
    // Implement your maintenance logic here
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.maintenanceButton}
        onPress={handleMaintenanceButtonPress}
      >
        <Text style={styles.buttonText}>Maintenance</Text>
      </TouchableOpacity>
    </View>
  );
};

const Stack = createStackNavigator();

const App = () => {
  const [notificationVisible, setNotificationVisible] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen {...props} showNotification={setNotificationVisible} />
          )}
        </Stack.Screen>
        <Stack.Screen name="RequestMachine" component={RequestMachineScreen} />
        <Stack.Screen name="Maintenance" component={MaintenanceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3E8FF",
  },
  additionalText: {
    marginBottom: 20,
    fontSize: 16,
    color: "#6A0DAD",
  },
  button: {
    backgroundColor: "#6A0DAD",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  requestButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  maintenanceButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});

export default App;
