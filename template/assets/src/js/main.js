import "jquery";
import "bootstrap";
import "../../../../node_modules/jasny-bootstrap/dist/js/jasny-bootstrap.min.js";
import "moment";
import 'angular';
import 'angular-sanitize';
import "../../../../node_modules/angular-bootstrap-dropdown/dist/bsDropdown.min.js";
import "angular-ui-router";
import "angular-moment";
import "angular-ui-bootstrap";
import "angular-bootstrap-checkbox";
import "./json-tree.js";

import './styles.js';

import API from './api-handler.js';

const app = angular.module('docs', ['angularMoment', 'ui.bootstrap', 'ui.checkbox', 'ngJsonTree', 'ng.bs.dropdown', 'ngSanitize']);
const configs = {
  endpoints: {
    list: '/docs/api'
  },
  appendTypes: [
    'HTTP header',
    'URL',
    'Payload'
  ]
}

app.controller( 'mainController', [ '$scope', '$http', 'moment', '$sce', ($scope, $http, moment, $sce) => {

  const privates = {
    assign: () => {
      $scope.appendTypes = configs.appendTypes;
      $scope.showKey = false;
      $scope.key = {
        name: 'api-key',
        type: configs.appendTypes[0]
      }
      $scope.response = { data: null, status: null, headers: null };
      $scope.current = null;
      $scope.toggle = privates.events.toggle;
      $scope.select = privates.events.select;
      $scope.post = privates.events.post;
      $scope.tagIt = privates.events.tagIt;
      $scope.explainFlag = (flag, value, item) => { return $sce.trustAsHtml(API.explain.flag(flag, value, item)); };
      $scope.explainRule = (rule, item) => { return $sce.trustAsHtml(API.explain.rule(rule, item)); };
    },
    events: {
      toggle: (connection) => {
        connection.show = !connection.show;
      },
      select: (api) => {
        $scope.current = api;
        $scope.url = API.make(api);
        $scope.path = API.getParams(api, 'path');;
        $scope.payload = API.getParams(api, 'payload');;
        $scope.query = API.getParams(api, 'query');
      },
      tagIt: (tag, $event) => {
        $scope.filterTerm = tag;
        $('#mainMenu').offcanvas('show');
        $event.stopPropagation();
      },
      post: () => {
        var params = API.toData( $scope.query.filter( (item) => { return item.include; }) );
        var data = API.toData( $scope.payload.filter( (item) => { return item.include; }) );
        var headers = {};
        if($scope.key.value){
          [ headers, params, data ][configs.appendTypes.indexOf($scope.key.type)][$scope.key.name] = $scope.key.value
        }
        $http({
          method: $scope.current.method,
          url: $scope.url,
          headers: headers,
          params: params,
          data: data
        }).then( (response) => {
          $scope.response = API.getResponse(response);
        }, (response) => {
          $scope.response = API.getResponse(response);
        });
      }
    },
    list: () => {
      $http.get(configs.endpoints.list)
        .then( (response) => {
          $scope.connections = response.data;
          $scope.connections[0].show = true;
        });
    }
  }
  privates.assign();
  privates.list();

}]);
