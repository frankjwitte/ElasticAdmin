/**
 * Created by Frank on 10/13/2014.
 */

var esAdmin = esAdmin || {};


esAdmin.module = angular.module('esadmin', []);

esAdmin.module.controller('mainController', function ($scope, $http, $window, elasticSearchService) {

    $scope.title = 'whatever';


    $scope.createIndex = function (indexName) {

        elasticSearchService.createIndex(indexName)
            .then(function (response) {
                alert('Index created successfully');
                $window.location.reload();
            }, function (response) {
                if (response.data.error) {
                    alert(response.data.error);
                }
                else {
                    alert('Failed to create index');
                }
                console.log(response);
            });

    }


});

esAdmin.module.directive('elasticIndices', function ($http, $window) {
    return {
        restrict: 'E',
        scope: {
            endpoint: '@'
        },
        templateUrl: 'templates/elasticIndices.html',
        link: function (scope) {
            scope.indices = [];
            var result = $http.get(scope.endpoint + '/_status');

            result.success(function (data) {
                scope.indices = data.indices;
                console.log(data);
            });


            scope.deleteIndex = function (indexName) {
                if (confirm('Are you sure you want to delete index ' + indexName)) {
                    $http.delete(scope.endpoint + '/' + indexName)
                        .success(function(){
                            $window.location.reload();
                        })
                        .error(function(response){
                            alert('failed to delete index');
                            console.log(response);
                        })
                }
            }


        }
    };
});

esAdmin.module.service('elasticSearchService', function ($http) {
    return {
        createIndex: function (indexName) {
            return $http.post('http://localhost:9200/' + indexName);
        }
    }
});