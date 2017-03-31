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

      // Creating data for Angular-Chart
      const monthlyIR = interestRate / 100 / 12;
      const paymentBeforeRounding =
        (loanAmount * monthlyIR) / (1 - (1 + monthlyIR) ** -loanPeriod);

      $scope.monthlyPayment = Math.round(paymentBeforeRounding * 100) / 100;

      // Labels are x-axis labels and serires are y-axis labels
      $scope.labels = _.range(1, $scope.loanData.loanPeriod + 1);
      $scope.series = ["Remaining Loan Amounts"]

      // Calculation to break down balances and monthly payments
      let balance = loanAmount;
      const balances = [];
      const principals = [];
      const interests = [];
      for (let i = 0; i < loanPeriod - 1; i++) {
        let interest = Math.round(balance * monthlyIR * 100) / 100;
        let principal = Math.round(($scope.monthlyPayment - interest) * 100) / 100;
        balance = Math.round((balance - principal) * 100) / 100;

        balances.push(balance)
        // More for future implementation to show breakdown of principal and interest
        interests.push(interest);
        principals.push(principal);
      }
      // Reamining balance at the end, which will be 0
      balances.push(0);

      // All options to make charts more readable
      $scope.data = [balances];
      $scope.xAxisID	= "Months"
      $scope.options = {
        legend: {
          display: true,
          position: "bottom"
        },
        animation: {
          duration: 6000
        },
        title: {
            display: true,
            text: "Loan Payment Over Time"
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
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: "Month"
            }
          }, ],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: "Loan Amounts in $"
            }
          }]
        }
      }
    } else {
      // Error handling message toggle on and off
      $scope.invalidSubmit = true;
    }
  };

  // Use service to fetch data
  intRates.get()
    .then( (response) => {
      $scope.intRates = response.data;
    });
}]);
