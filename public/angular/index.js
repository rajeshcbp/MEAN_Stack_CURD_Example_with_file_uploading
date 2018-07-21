var app = angular.module('index', ['config', 'ngCookies', 'ui-notification'])

var baseAddress = config_module._invokeQueue[0][2][1].LOGIN_URL;
var url = "";

app.factory('indexFactory', function ($http, $window) {
    return {
       
        getAllProductDetails: function () {
            url = baseAddress + "GetAllProductDetails";
            return $http.get(url);
        },
        getProductDetails: function (Id) {
            url = baseAddress + "GetProductDetails/" + Id;
            return $http.get(url);
        }
       
    };
});


app.controller('indexController', function ($scope, $http, indexFactory, $cookies, $cookieStore, $window, $location, Notification) {
   
    //get all accounts
    $scope.getAdmin = function () {
        indexFactory.getAllProductDetails().success(function (resultData1) {
            console.log("resultData1==", resultData1);
            $scope.products = resultData1;
            $scope.Productslength = $scope.products.length;
            console.log("Total products==", $scope.Productslength);
        })
    }
    $scope.getAdmin();

    // Window refresh
    $scope.refresh = function () {
        $window.location.reload();
        // window.location.href = "/";
    };

  
    // Get single Product details
    $scope.getDetails = function (Id) {
        $scope.ProductId = Id
        console.log("$scope.ProductId =", $scope.ProductId);
        indexFactory.getProductDetails($scope.ProductId).success(function (data) {
            if (data) {
                $scope.myProductDetails = data;
                console.log("$scope.myProductDetails =", $scope.myProductDetails);

            } else {

                console.log("errorMessage =", $scope.errorMessage);
            }
        }).error(function (data) {
            Notification.error({
                message: ProductData.name + ' ' + ',ProductProfile Adding Failed ',
                delay: 1000
            });
            //$scope.error = "An Error has occured while Adding ProductProfile! " + data.ExceptionMessage;
        });
        //End of signup api invoke    
    };

})



