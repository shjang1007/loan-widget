// Set up express and port
const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const sassMiddleware = require("node-sass-middleware");

const app = express();
const port = process.env.PORT || 8080;


// Middleware
app.use(sassMiddleware({
    src: __dirname + "/scss",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "compressed",
    prefix: '/styles'
})); // Compiles sass to css
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// Get loan info
app.get("/interest-rates", (req, res) => {
  const loanInterestRateList = [
    {loan: "Direct Subsidized Loan", rate: 3.76},
    {loan: "Direct Unsubsidized Loan", rate: 3.76},
    {loan: "Private Bank", rate: 4.2},
    {loan: "University", rate: 4}
  ];

  // Send requested from loanInterestRateList
  res.send(loanInterestRateList);
});

// load the single view file
app.get('*', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Start app with "node server.js" with anonymous callback to log
// port information
app.listen(port, () => {
  console.log("App started on port " + port);
});
