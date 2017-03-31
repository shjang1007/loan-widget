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
      const unRoundedNum =
        (loanAmount * monthlyIR) / (1 - (1 + monthlyIR) ** -loanPeriod);
      $scope.monthlyPayment = Math.round(unRoundedNum * 100) / 100

      $scope.labels = _.range(1, $scope.loanData.loanPeriod + 1);
      $scope.series = ["Balance"]

      let balance = loanAmount;
      const balances = [];
      const principals = [];
      const interests = [];
      for (let i = 0; i < loanPeriod - 1; i++) {
        let interest = Math.round(balance * monthlyIR * 100) / 100;
        let principal = Math.round(($scope.monthlyPayment - interest) * 100) / 100;
        balance = Math.round((balance - principal) * 100) / 100;
        interests.push(interest);
        principals.push(principal);
        balances.push(balance)
      }
      balances.push(0);
      $scope.data = [balances]
      $scope.options = {
        legend: {
          display: true,
          position: "bottom"
         },
        title: {
            display: true,
            text: "LoanWidget Chart"
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const label = data.datasets[tooltipItem.datasetIndex].label;
              // Format number using delimiter
              const remainingLoan = tooltipItem.yLabel.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              return `${label}: $${remainingLoan}`;
            },
            title: (tooltipItem, data) => {
              return `Month ${tooltipItem[0].xLabel}`;
            }
          }
        }
      }
    } else {
      $scope.invalidSubmit = true;
    }
  };

  intRates.get()
    .then( (response) => {
      $scope.intRates = response.data;
    });
}]);

// app.controller("PaymentBreakDown", ["$scope", ($scope) => {
//   $scope.series = ["Principal", "Interest"];
//   $scope.data = [principals, interests];
//
//   // Possibly have to add legend display to display detailed info
//   $scope.options = {
//     scales: {
//       xAxes: [{stacked: true}],
//       yAxes: [{stacked: true}]
//     }
//   };
// }]);
