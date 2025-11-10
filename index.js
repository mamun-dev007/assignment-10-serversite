const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 3000;

app.use(cors()); 
// 03nmHoAZBuigvseY
// Habit-Tracker
// const uri = `mongodb+srv://${DB_USER}:${db_password}@cluster0.6dcy7ej.mongodb.net/?appName=Cluster0`;
const uri = `mongodb+srv://Habit-Tracker:03nmHoAZBuigvseY@cluster0.6dcy7ej.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    
    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    await client.close();
  }
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})



run().catch(console.dir);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
