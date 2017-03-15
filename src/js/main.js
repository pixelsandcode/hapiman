import "jquery";
import "bootstrap";
import "../../node_modules/jasny-bootstrap/dist/js/jasny-bootstrap.min.js";
import "moment";
import 'angular';
import "angular-ui-router";
import "angular-moment";
import "angular-ui-bootstrap";
import "angular-bootstrap-checkbox";
import "./json-tree.js";

import css from '../css/main.css'

const app = angular.module('docs', ['angularMoment', 'ui.bootstrap', 'ui.checkbox', 'ngJsonTree']);

const configs = {
  endpoints: {
    list: '/docs/api'
  }
}

app.controller( 'mainController', [ '$scope', '$http', 'moment', ($scope, $http, moment) => {

  const methods = {
    assign: () => {
      $scope.response = {};
      $scope.current = null;
      $scope.toggle = methods.events.toggle;
      $scope.select = methods.events.select;
      $scope.post = methods.events.post;
      $scope.tagIt = methods.events.tagIt;
    },
    events: {
      toggle: (connection) => {
        connection.show = !connection.show;
      },
      select: (api) => {
        $scope.current = api;
        $scope.url = methods.getUrl(api);
        $scope.payload = methods.getPayload(api);
        $scope.query = methods.getQuery(api);
      },
      tagIt: (tag) => {
        $scope.filterTerm = tag;
        $('#mainMenu').offcanvas('show');
      },
      post: () => {
        var params = $scope.payload.filter( (item) => {
          return item.include;
        });
        var data = methods.toData(params);
        $http.post($scope.url, data)
          .then( (response) => {
            $scope.response = response.data;
          }, (response) => {
            $scope.response = response.data;
          });
      }
    },
    toData: (params) => {
      var data = {};
      params.forEach( (item) => {
        data[item.name] = item.value
      });
      return data;
    },
    getUrl: (api) => {
      var url = api.path;
      if(api.params.path) {
        var params = api.params.path.children;
        for(var key in params) {
          var item = params[key];
          if(item.examples[0])
            url = url.replace(`{${key}}`, item.examples[0]);
        }
      }
      return url;
    },
    getPayload: (api) => {
      var params = [];
      if(api.params.payload) {
        var payload = api.params.payload.children;
        for(var key in payload) {
          var item = payload[key];
          var required = (item.flags||{}).presence == "required"
          params.push( { name: key, value: item.examples[0], required: required, include: required } );
        }
      }
      return params;
    },
    getQuery: (api) => {
      var params = [];
      if(api.params.query) {
        var query = api.params.query.children;
        for(var key in query) {
          var item = query[key];
          var required = (item.flags||{}).presence == "required"
          params.push( { name: key, value: item.examples[0], required: required, include: required } );
        }
      }
      return params;
    },
    list: () => {
      $http.get(configs.endpoints.list)
        .then( (response) => {
          $scope.connections = response.data;
          $scope.connections[0].show = true;
        });
    }
  }
  methods.assign();
  methods.list();

}]);
