// Notification.js
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Notification = ({show}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 5000); // Notification will be hidden after 5 seconds
    }
  }, [show]);

  return (
    <View>
      {isVisible && <Text style={styles.notification}>A washing machine is now available!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  notification: {
    backgroundColor: 'green',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    fontSize: 16,
  },
});

export default Notification;