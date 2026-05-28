// WashingMachineButton.js
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const WashingMachineButton = ({ onPress }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [machineAvailable, setMachineAvailable] = useState(null);

  const handlePress = async () => {
    setIsLoading(true);
    const available = await onPress(); // Trigger onPress function to check availability
    setIsLoading(false);

    if (available) {
      setMachineAvailable(true);
    } else {
      // If machine is not available immediately, set a timeout to check again after 20 minutes
      setTimeout(() => {
        setMachineAvailable(true);
      }, 20 * 60 * 1000); // 20 minutes in milliseconds
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress} disabled={isLoading || machineAvailable === true}>
      <Text style={styles.text}>Request Washing Machine</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6A0DAD', // Dark purplish color
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WashingMachineButton;
