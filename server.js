// Set up express and port
const express = require("express");
const bodyParser = require("body-parser");
const sassMiddleware = require("node-sass-middleware");

const app = express();
const port = process.env.PORT || 8080;


// Middleware
app.use(sassMiddleware({
    src: __dirname,
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/prefix'
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/app"));

// Get loan info
app.get("/interest-rates", (req, res) => {
  const loanInterestRateList = {
    subsidizedLoan: "3.76",
    unsubsidizedLoan: "3.76",
    privateBank: "4.2",
    university: "4"
  };

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
