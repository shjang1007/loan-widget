// Set up express and port
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Get loan info
app.get("/", (req, res) => {
  res.send("Let's help save the world!");
});

// Start app with "node server.js" with anonymous callback to log
// port information
app.listen(port, () => {
  console.log("App started on port " + port);
});
