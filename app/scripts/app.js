'use strict';

angular.module('myApp', ['ng-token-auth', 'ui.router', 'myControllers', 'myServices'])
    .config(function($authProvider, $stateProvider, $urlRouterProvider) {
        $authProvider.configure({
            apiUrl: 'http://localhost:3000/'
        });

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('main', {
                url: '/',
                templateUrl: 'partials/mainForm.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'partials/loginForm.html'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'partials/registerForm.html'
            });
    })
    .run(function($rootScope, $state, $auth) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
            return $auth.validateUser().then(
                function() {
                    if (toState.name === 'login' || toState.name === 'register') {
                        $state.go('main');
                        return event.preventDefault();
                    }
                },
                function() {
                    if (toState.name === 'main') {
                        $state.go('login');
                        return event.preventDefault();
                    }
                });
        });

        $rootScope.$on('auth:login-success', function(event) {
            $state.go('main');
            return event.preventDefault();
        });

        $rootScope.$on('auth:logout-success', function(event) {
            $state.go('login');
            return event.preventDefault();
        });
    });
