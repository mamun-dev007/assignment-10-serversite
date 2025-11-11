const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://Habit-Tracker:03nmHoAZBuigvseY@cluster0.6dcy7ej.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected successfully!");

   
    const db = client.db("habitTrackerDB");
    const habitsCollection = db.collection("habits");

    //  POST (Add Habit)
    app.post("/api/habits", async (req, res) => {
      const habit = req.body;
      const result = await habitsCollection.insertOne(habit);
      res.send(result);
    });

    //  GET (All Habits)
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
  const habits = await habitsCollection.find({ userEmail: email }).toArray();
  res.send(habits);
});


    app.get('/', (req, res) => {
      res.send('Habit Tracker Server is Running 🚀');
    });

  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});
