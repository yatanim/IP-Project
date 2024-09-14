const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 7000;
const mongoose = require('mongoose');
const mongoDB = require("./db");
const cors = require('cors');
app.use(bodyParser.json());

// Enable CORS middleware
app.use(cors({
    origin: "http://127.0.0.1:5502",
    credentials: true,
    optionSuccessStatus: 200,
}));

mongoDB();

// Endpoint to fetch fare information based on "from" and "to" locations
app.post('/getFare', async (req, res) => {
  try {
    const { from, to } = req.body;
    console.log(`Fetching fare information from ${from} to ${to}`); // Debugging log
    const fareInfo = await fetchFareFromDB(from, to);
    console.log(`Fare information: ${JSON.stringify(fareInfo)}`); // Debugging log
    res.json(fareInfo);
  } catch (error) {
    console.error("Error fetching fare information:", error);
    res.status(500).json({ error: "Failed to fetch fare information" });
  }
});

// Function to fetch fare information from the database
const fetchFareFromDB = async (from, to) => {
  const fareInfo = await mongoose.connection.db.collection("route")
    .findOne({ from: from, to: to });
  console.log(fareInfo);
  return fareInfo;
};

// Endpoint to update fare information
app.put('/updateFare', async (req, res) => {
  try {
    const { from, to, bus, cng } = req.body;
    console.log(`Updating fare information for ${from} to ${to}`); // Debugging log

    const updatedFareInfo = await updateFareInDB(from, to, bus, cng);
    console.log(`Updated fare information: ${JSON.stringify(updatedFareInfo)}`); // Debugging log
    res.json({ success: true, message: 'Fare updated successfully', data: updatedFareInfo });
  } catch (error) {
    console.error("Error updating fare information:", error);
    res.status(500).json({ error: "Failed to update fare information" });
  }
});

// Function to update fare information in the database
const updateFareInDB = async (from, to, bus, cng) => {
  const updateFields = {};
  if (bus !== undefined) updateFields.bus = bus;
  if (cng !== undefined) updateFields.cng = cng;

  return await mongoose.connection.db.collection("route")
    .findOneAndUpdate(
      { from: from, to: to },
      { $set: updateFields },
      { returnOriginal: false } // Returns the updated document
    );
};

// Endpoint to delete fare information
app.delete('/deleteFare', async (req, res) => {
  try {
    const { from, to } = req.body;
    console.log(`Deleting fare information for ${from} to ${to}`); // Debugging log

    const deleteResult = await deleteFareFromDB(from, to);
    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: "No fare information found to delete" });
    }

    console.log(`Deleted fare information for ${from} to ${to}`); // Debugging log
    res.json({ success: true, message: 'Fare deleted successfully' });
  } catch (error) {
    console.error("Error deleting fare information:", error);
    res.status(500).json({ error: "Failed to delete fare information" });
  }
});

// Function to delete fare information from the database
const deleteFareFromDB = async (from, to) => {
  return await mongoose.connection.db.collection("route")
    .deleteOne({ from: from, to: to });
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
