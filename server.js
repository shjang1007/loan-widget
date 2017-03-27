// Set up express and port
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Get loan info
app.get("/", (req, res) => {
  const loanInterestRateList = {
    subsidizedLoan: "3.76",
    unsubsidizedLoan: "3.76",
    privateBank: "4.2",
    university: "4"
  };

  // Send requested from loanInterestRateList
  res.send(loanInterestRateList.privateBank);
});

// Start app with "node server.js" with anonymous callback to log
// port information
app.listen(port, () => {
  console.log("App started on port " + port);
});
