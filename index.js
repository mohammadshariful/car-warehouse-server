const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT, (error, decoded) => {
    if (error) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

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
    const upCommingCars = client
      .db("warehouseManagement")
      .collection("upcommingCars");
    const carsGallary = client
      .db("warehouseManagement")
      .collection("carsGallary");
    const reviewsCollection = client
      .db("warehouseManagement")
      .collection("reviews");

    //Auth

    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRECT, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });

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
    //popular single get car api
    app.get("/popularCars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const car = await popularCarsCollection.findOne(query);
      res.send(car);
    });

    //popular car delete api
    app.delete("/popularCars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await popularCarsCollection.deleteOne(query);
      res.send(result);
    });
    //update popularCar quantity api
    app.put("/popularCars/:id", async (req, res) => {
      const id = req.params.id;
      const carQuantity = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: carQuantity.newQuantity,
        },
      };
      const result = await popularCarsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // get add items
    app.get("/getCars", verifyJWT, async (req, res) => {
      const decodedEmail = req.decoded.emailValue;
      const email = req.query.email;
      if (email === decodedEmail) {
        const query = { email };
        const cursor = popularCarsCollection.find(query);
        const cars = await cursor.toArray();
        res.send(cars);
      } else {
        res.status(403).send({ message: "forbidden access" });
      }
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
    // get upcomming cars api
    app.get("/upcommingCars", async (req, res) => {
      const query = {};
      const cursor = upCommingCars.find(query);
      const upcommingCars = await cursor.toArray();
      res.send(upcommingCars);
    });
    // car gallary get api
    //catagory
    app.get("/carGallaries", async (req, res) => {
      const query = {};
      const cursor = carsGallary.find(query);
      const popularCars = await cursor.toArray();
      res.send(popularCars);
    });
    //catagory
    app.get("/carGallary", async (req, res) => {
      const catagory = req.query.catagory;
      const query = { catagory: catagory };
      const cursor = carsGallary.find(query);
      const popularCars = await cursor.toArray();
      res.send(popularCars);
    });
    // reviews api
    //get reviews api
    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewsCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    // review post api
    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      const result = await reviewsCollection.insertOne(reviews);
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
