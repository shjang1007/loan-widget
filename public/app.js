const app = angular.module("loanWidget", ["chart.js"]);

// create controller that fetches
// Other than that it's all just functions
// I need form
// I need graph

app.factory("intRates", ["$http", ($http) => {
  return {
    get: () => {
      return $http.get("/interest-rates");
    }
  };
}]);

app.controller("BarCtrl", ["$scope", ($scope) => {
  $scope.first = $scope.intRates;

  // labels will be x-axis and series will be y-axis values
  $scope.labels = ['1', '2', '3', '4', '5', '6', '7'];
  $scope.series = ['Interest', 'Principal'];

  $scope.data = [
   [15000, 12500, 10000, 7500, 5000, 2500, 0],
   [30000, 25000, 20000, 15000, 10000, 5000, 2500]
 ];

 // Possibly have to add legend display to display detailed info
 $scope.options = {
   scales: {
     xAxes: [{stacked: true}],
     yAxes: [{stacked: true}]
   }
  };
}]);

app.controller("MainCtrl", ["$scope", "intRates", ($scope, intRates) => {
  // Variables to help toggle show and class
  $scope.invalidSubmit = false;
  $scope.isFlipped = false;

  // Function that will handle form submission.
  $scope.handleSubmit = () => {
    if ($scope.loanAmount && $scope.interestRate && $scope.loanPeriod) {
      $scope.invalidSubmit = false;
      $scope.isFlipped = true;
    } else {
      $scope.invalidSubmit = true;
    }
  };

  intRates.get()
    .then( (response) => {
      $scope.intRates = response.data;
    });
}]);
