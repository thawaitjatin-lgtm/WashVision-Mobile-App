// services/databaseService.js
export const checkMachineAvailability = () => {
    // Simulate database scan
    const isAvailable = Math.random() < 0.5; // 50% chance of being available
    return isAvailable;
  }
  