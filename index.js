const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//roote api
app.get("/", (req, res) => {
  res.send("welcome to car rev website");
});

//lisiten port
app.listen(port, () => {
  console.log("car rev server running", port);
});
