const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://tanim:tanim007@cluster0.cweutrw.mongodb.net/map?retryWrites=true&w=majority&appName=Cluster0';

const mongoDB = async () => {
  try { 
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

  } catch (error) {
    console.error("MongoDB connection error:", error);
    setTimeout(mongoDB, 5000); // Retry after 5 seconds
  }
};

module.exports = mongoDB;
