// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dotenv = require("dotenv");
// Create Express app
const app = express();

// Set up middleware for parsing JSON requests
app.use(bodyParser.json());



dotenv.config({ path: "./config.env" });
const dbURL = process.env.DATABASE;
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
  })
  .then((p) => {
    console.log("DB connection success");
  });



// Define a schema for sensor readings
const sensorReadingSchema = new mongoose.Schema({
    sensorId: String,
    timestamp: { type: Date, default: Date.now },
    value: Number
});

// Define a model based on the schema
const SensorReading = mongoose.model('SensorReading', sensorReadingSchema);

// Route to handle POST requests to store sensor readings
app.post('/reading',async (req, res) => {
    // Extract sensor reading data from request body
    try{
    const { sensorId, value, timestamp } = req.body;

    // Create a new sensor reading document
    const newReading = new SensorReading({
        sensorId: sensorId,
        value: value,
        timestamp: timestamp
    });

    // Save the sensor reading to the database
    await newReading.save();
     

    res.status(201).json({ message: 'Sensor data received and saved.' });

       
    }catch(err){

    res.status(500).json({ message: error.message });

    }
    
});
app.get('/readings', async (req, res) => {
  try {
    // Retrieve all sensor readings from the database
    const allReadings = await SensorReading.find();
    res.status(200).json(allReadings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/readings/:sensorId', async (req, res) => {
  try {
    const sensorId = req.params.sensorId;

    // Retrieve the latest sensor reading for the given sensorId
    const latestReading = await SensorReading.findOne({ sensorId })
      .sort('-timestamp')
      .exec();

    if (latestReading) {
      res.status(200).json(latestReading);
    } else {
      res.status(404).json({ message: 'No readings found for the given sensorId.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// API endpoint to get total wash cycles for all sensors on a given day
app.get('/washcycles/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Find all sensor readings for the given day
    const readings = await SensorReading.find({
      timestamp: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ sensorId: 1, timestamp: 1 });

    // Calculate wash cycles for all sensors
    let washCycleCount = 0;
    let lastWashCycleEnd = {};
    let lastReadingTimestamp = {};

    readings.forEach(reading => {
      const { sensorId, timestamp } = reading;

      // If the sensorId is encountered for the first time or the current reading is more than 3 minutes from the last reading, start a new wash cycle
      if (!lastReadingTimestamp[sensorId] || Math.abs(timestamp - lastReadingTimestamp[sensorId])  > 180000) {
        washCycleCount++;
        lastWashCycleEnd[sensorId] = new Date(timestamp.getTime() + (40 * 60000)); // Assuming wash cycle lasts 40-60 minutes
      }

      // Update the last reading timestamp for the current sensorId
      lastReadingTimestamp[sensorId] = timestamp;

      // Update lastWashCycleEnd if necessary (if the wash cycle duration exceeds 60 minutes)
      if (timestamp > lastWashCycleEnd[sensorId]) {
        lastWashCycleEnd[sensorId] = new Date(timestamp.getTime() + (40 * 60000)); // Assuming wash cycle lasts 40-60 minutes
      }
    });

    res.status(200).json({ washCycleCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/washcycles/:sensorId/:date', async (req, res) => {
  try {
    const sensorId = req.params.sensorId;
    const date = new Date(req.params.date);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);



    // Find sensor readings for the given sensorId and day
    const readings = await SensorReading.find({
      sensorId,
      timestamp: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ timestamp: 1 });



    // Calculate wash cycles for the specific sensor
     // Calculate wash cycles for all sensors
    let washCycleCount = 0;
    let lastWashCycleEnd = {};
    let lastReadingTimestamp = {};

     readings.forEach(reading => {
      const { sensorId, timestamp } = reading;

      // If the sensorId is encountered for the first time or the current reading is more than 3 minutes from the last reading, start a new wash cycle
      if (!lastReadingTimestamp[sensorId] || Math.abs(timestamp - lastReadingTimestamp[sensorId])  > 180000) {
        washCycleCount++;
        lastWashCycleEnd[sensorId] = new Date(timestamp.getTime() + (40 * 60000)); // Assuming wash cycle lasts 40-60 minutes
      }

      // Update the last reading timestamp for the current sensorId
      lastReadingTimestamp[sensorId] = timestamp;

      // Update lastWashCycleEnd if necessary (if the wash cycle duration exceeds 60 minutes)
      if (timestamp > lastWashCycleEnd[sensorId]) {
        lastWashCycleEnd[sensorId] = new Date(timestamp.getTime() + (40 * 60000)); // Assuming wash cycle lasts 40-60 minutes
      }
    });



    res.status(200).json({ washCycleCount });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
