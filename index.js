const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();
app.use(cors());
app.use(express.json());
 
const uri = process.env.MONGO_URI;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true, 
    deprecationErrors: true,
  },
}); 

 
app.get('/', (req, res) => {
  res.send(" Habit Tracker Server is Running");
});

async function run() {
  try {
    await client.connect();

    
    const db = client.db("habitTrackerDB");
    const habitsCollection = db.collection("habits");
    

    app.post("/api/habits", async (req, res) => {
      const habit = req.body;
      const result = await habitsCollection.insertOne({
        ...habit,
        createdAt: new Date(),
        streak: habit.streak || 0,
      });
      res.send(result);
    });

    app.get("/api/habits", async (req, res) => {
      const habits = await habitsCollection.find().toArray();
      res.send(habits);
    });

    app.get("/api/public-habits", async (req, res) => {
      const habits = await habitsCollection.find({ isPublic: true }).toArray();
      res.send(habits);
    });

    app.get("/api/my-habits/:email", async (req, res) => {
      const email = req.params.email;
      const habits = await habitsCollection
        .find({ userEmail: email })
        .toArray();
      res.send(habits);
    });

   app.delete("/api/habits/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await habitsCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  } catch (error) {
    console.error("DELETE Habit Error:", error);
    res.status(500).send({ message: "Failed to delete habit", error: error.message });
  }
});


    app.patch("/api/habits/complete/:id", async (req, res) => {
      const id = req.params.id;
      const result = await habitsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { streak: 1 } }
      );
      res.send(result);
    });

app.get("/api/habits/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await habitsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      return res.status(404).send({ message: "Habit not found" });
    }
    res.send(result);
  } catch (error) {
    console.error("GET single habit error:", error);
    res.status(500).send({ message: "Failed to fetch habit", error: error.message });
  }
});

app.get("/api/featured-habits", async (req, res) => {
  try {
    const habits = await habitsCollection
      .find({ isPublic: true }).sort({ createdAt: -1 }).limit(6).toArray();

    res.send(habits);
  } catch (error) {
    console.error(" Error fetching featured habits:", error);
    res.status(500).send({ message: "Failed to load featured habits" });
  }
}); 


app.put("/api/habits/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body; 
    const result = await habitsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    res.send(result);
  } catch (error) {
    console.error("UPDATE Habit Error:", error);
    res.status(500).send({ message: "Failed to update habit", error: error.message });
  }
});


  } catch (error) { 
    console.error(" Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(` Server listening on port ${port}`);
});
