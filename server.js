// Set up express and port
const express = require("express");
const bodyParser = require("body-parser");
const sassMiddleware = require("node-sass-middleware");

const app = express();
const port = process.env.PORT || 8080;


// Middleware
app.use(sassMiddleware({
    src: __dirname + "/sass",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: 'compressed'
}));

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

// Get loan info
app.get("/interest-rates", (req, res) => {
  const loanInterestRateList = [
    {loan: "subsidizedLoan", rate: 3.76},
    {loan: "unsubsidizedLoan", rate: 3.76},
    {loan: "privateBank", rate: 4.2},
    {loan: "university", rate: 4}
  ];

  // Send requested from loanInterestRateList
  res.send(loanInterestRateList);
});

  // load the single view file
app.get('*', (req, res) => {
    res.sendfile("index.html");
});

// Start app with "node server.js" with anonymous callback to log
// port information
app.listen(port, () => {
  console.log("App started on port " + port);
});
