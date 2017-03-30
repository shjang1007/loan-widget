const app = angular.module("loanWidget", ["chart.js"])

// Require lodash
app.constant('_', window._);

// Service to fetch interest rates from node api
app.factory("intRates", ["$http", ($http) => {
  return {
    get: () => {
      return $http.get("/interest-rates");
    }
  };
}]);

app.controller("MainCtrl", ["$scope", "intRates", "_",
  ($scope, intRates, _) => {
  // Variables to help toggle show and class
  $scope.invalidSubmit = false;
  $scope.isFlipped = false;
  $scope.loanData = {};

  // Function that will handle form submission.
  $scope.handleSubmit = () => {
    const { loanAmount, interestRate, loanPeriod }  = $scope.loanData;
    if (loanAmount && interestRate && loanPeriod) {
      $scope.invalidSubmit = false;
      $scope.isFlipped = true;
      const monthlyIR = interestRate / 12;
      $scope.monthlyPayment = (loanAmount * monthlyIR) / (1 - (1 + monthlyIR) ** -loanPeriod);
      $scope.labels = _.range(1, $scope.loanData.loanPeriod + 1);
      $scope.series = ["Principal", "Interest"];

      let balance = loanAmount;
      const balances = [];
      const principals = [];
      const interests = [];
      while (balance > 0) {
        let interest = balance * monthlyIR;
        let principal = $scope.monthlyPayment - interest;
        balance -= principal;
        interests.push(interest);
        principals.push(principal);
        balances.push(balance)
      }

      $scope.data = [principals, interests];

     // Possibly have to add legend display to display detailed info
     $scope.options = {
       scales: {
         xAxes: [{stacked: true}],
         yAxes: [{stacked: true}]
       }
      };
    } else {
      $scope.invalidSubmit = true;
    }
  };

  intRates.get()
    .then( (response) => {
      $scope.intRates = response.data;
    });
}]);
