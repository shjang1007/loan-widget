const app = angular.module("loanWidget", []);

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


// Create directive to draw graph and embed directive inside canvas
app.directive("drawChart", () => {

});
