'use strict';

var app = angular.module('docs', ['angularMoment', 'ui.bootstrap']);

var configs = {
  endpoints: {
    list: '/docs/api'
  }
};

app.controller('mainController', ['$scope', '$http', 'moment', function ($scope, $http, moment) {

  var methods = {
    assign: function assign() {},
    list: function list() {
      $http.get(configs.endpoints.list).success(function (data) {
        $scope.connections = data;
      });
    }
  };
  methods.assign();
  methods.list();
}]);
