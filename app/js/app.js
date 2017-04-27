'use strict';

var angular = require('angular');

require('angular-route');
require('angular-modal-service');
require('angular-animate');

var app = angular.module('mSearchApp', ['ngRoute', 'angularModalService', 'ngAnimate']);

require('./services');
require('./controllers');

app.filter('trackDuration', function() {

    return function(ms) {
        var minutes = Math.floor(ms / 60000);
        var seconds = ((ms % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    };
})

app.config(function($routeProvider) {
    $routeProvider.when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .otherwise({
            redirectTo: '/'
        })
});
