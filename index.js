const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rnivn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const popularCarsCollection = client
      .db("warehouseManagement")
      .collection("popularCars");
    const commentCollection = client
      .db("warehouseManagement")
      .collection("comments");

    //popular car get api
    app.get("/popularCars", async (req, res) => {
      const query = {};
      const cursor = popularCarsCollection.find(query);
      const popularCars = await cursor.toArray();
      res.send(popularCars);
    });
    //popular car post api
    app.post("/popularCars", async (req, res) => {
      const carInfo = req.body;
      const popularCars = await popularCarsCollection.insertOne(carInfo);
      res.send(popularCars);
    });
    //popular car delete api
    app.delete("/popularCars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await popularCarsCollection.deleteOne(query);
      res.send(result);
    });

    // get add items
    app.get("/getCars", async (req, res) => {
      const email = req.query.email;
      const query = { email };
      const cursor = popularCarsCollection.find(query);
      const cars = await cursor.toArray();
      res.send(cars);
    });
    // delete add items
    app.delete("/getCars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await popularCarsCollection.deleteOne(query);
      res.send(result);
    });

    //comments api
    app.get("/comment", async (req, res) => {
      const query = {};
      const cursor = commentCollection.find(query);
      const comment = await cursor.toArray();
      res.send(comment);
    });

    app.post("/comment", async (req, res) => {
      const comment = req.body;
      const result = await commentCollection.insertOne(comment);
      res.send(result);
    });

    app.delete("/comment/:id", async (req, res) => {
      const id = req.params;
      const query = { _id: ObjectId(id) };
      const result = await commentCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    //  await client.close();
  }
}
run().catch(console.dir);

//roote api
app.get("/", (req, res) => {
  res.send("welcome to car rev website");
});

//lisiten port
app.listen(port, () => {
  console.log("car rev server running", port);
});
