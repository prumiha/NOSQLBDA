const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("mongo");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
}

async function closeDatabaseConnection() {
    try {
      await client.close();
      console.log("MongoDB connection closed");
    } catch (error) {
      console.error("Error closing MongoDB connection", error);
      throw error;
    }
  }
  
  module.exports = {
    connectToDatabase,
    closeDatabaseConnection
  };