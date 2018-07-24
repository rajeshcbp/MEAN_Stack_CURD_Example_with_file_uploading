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
        },
        deleteProductDetails: function (Id) {
            url = baseAddress + "DeleteProductDetails/" + Id;
            return $http.delete(url);
        }

    };
});




app.controller('indexController', function ($scope, $http, indexFactory, $cookies, $cookieStore, $window, $location, Notification) {
            $scope.editMode = 0;
            console.log(" editMode==", $scope.editMode);
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

            // hideShowTable 
            $scope.hideShowTable = function () {
                $scope.editMode = 1;
                console.log(" editMode==", $scope.editMode);
            };


            // Window refresh
            $scope.hideEditTable = function () {
                $scope.editMode = 0;
                console.log(" editMode==", $scope.editMode);
            };






            // Get single Product details
            $scope.getDetails = function (Id) {
                $scope.ProductId = Id
                console.log("$scope.ProductId =", $scope.ProductId);
                indexFactory.getProductDetails($scope.ProductId).success(function (data) {
                    if (data) {
                        $scope.myProductDetails = data;
                        console.log("$scope.myProductDetails =", $scope.myProductDetails);

                        // sharedDetails.addData($scope.Product);
                        // console.log("$scope.ProductDetails==", $scope.ProductDetails);
                        // window.location.href = "/Details";
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

            // sendtodelete Product

            $scope.sendToDeleteProduct = function (id) {
                $scope.productId = id;
                console.log("productId==", $scope.productId);
            };
            //deleteProductId
            $scope.delete = function (Id) {
                $scope.productIdToBeDelete = Id;
                console.log("productIdToBeDelete==", $scope.productIdToBeDelete);
                indexFactory.deleteProductDetails($scope.productIdToBeDelete).success(function (data) {

                    if (data) {
                        Notification.success({
                            message: 'Product deleted ',
                            delay: null
                        });
                        //Notification.success('Class deleted');
                    }
                    $window.location.reload();
                }).error(function (data) {
                    Notification.error({
                        message: ' Product Delete Failed ',
                        delay: 1000
                    });
                    //$scope.error = "An Error has occured while Deleting school! " + data.ExceptionMessage;

                    $('#myDeleteModal').modal('hide');
                });



            }
        })