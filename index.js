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
    const carsCollection = client.db("warehouseManagement").collection("cars");
    console.log("mongodb connect");
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
