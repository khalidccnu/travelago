require("dotenv").config();
const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Travelago is running...");
});

app.listen(port, (_) => {
  console.log(`Travelago API is running on port: ${port}`);
});
