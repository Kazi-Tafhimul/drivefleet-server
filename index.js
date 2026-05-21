const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("driverfleetDB")
    const carCollection = db.collection("cars");
    app.get("/car", async (req, res) => {
        const result = await carCollection.find().toArray();
        res.json(result);
    })


    app.post("/car", async (req, res) => {
        const carData = req.body;
        console.log(carData)
        const result = await carCollection.insertOne(carData);
        res.json(result);
    })
    app.get("/car/:id", async (req, res) =>{
        const {id} = req.params;
        const result = await carCollection.findOne({_id: new ObjectId(id)});
        res.json(result);
    })
    await client.db("driverfleetDB").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("server is running");
})
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

