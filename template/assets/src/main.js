const app = angular.module('docs', ['angularMoment', 'ui.bootstrap']);

const configs = {
  endpoints: {
    list: '/docs/api'
  }
}


app.controller( 'mainController', [ '$scope', '$http', 'moment', ($scope, $http, moment) => {

  const methods = {
    assign: () => {
    },
    list: () => {
      $http.get(configs.endpoints.list)
        .success( (data) => {
          $scope.connections = data;
        });
    }
  }
  methods.assign();
  methods.list();

}]);
