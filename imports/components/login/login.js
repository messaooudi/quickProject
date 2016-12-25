import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'
import { Accounts } from 'meteor/accounts-base'



//in order to use any schema u should import its js file 
//import { databaseExemple } from '../../database/template';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');


class Login {
    constructor($scope, $reactive, $timeout,$window) {
        'ngInject';

        $reactive(this).attach($scope);
        var vm = this;

        vm.emailNotFound = false;
        vm.passwordNotFound = false;

        vm.emailTaken = false;

        vm.singIn = {
            userName: '',
            password: ''
        }

        vm.singUp = {
            userName: '',
            firstName: '',
            lastName: '',
            phone: '',
            password: ''
        }

        vm.login = function () {
            Meteor.loginWithPassword(vm.singIn.userName, vm.singIn.password, function (error) {
                if (error) {
                    if (error.reason == 'User not found') {
                        vm.emailNotFound = true;
                        $timeout(function () {
                            vm.emailNotFound = false;
                        }, 4000)
                    }
                    if (error.reason == 'Incorrect password') {
                        vm.passwordNotFound = true;
                        $timeout(function () {
                            vm.passwordNotFound = false;
                        }, 4000)
                    }
                } else {
                    $window.location.href = "/birth/list"
                }
            })
        }

        vm.createUser = function () {
            Accounts.createUser({
                email: vm.singUp.userName,
                password: vm.singUp.password,
                profile: {
                    firstName: vm.singUp.firstName,
                    lastName: vm.singUp.lastName,
                    phone: vm.singUp.phone,
                    mask: '001'
                }
            }, function (err) {
                if (err) {
                    if (err.reason == "Email already exists.") {
                        vm.emailTaken = true;
                        $timeout(function () {
                            vm.emailTaken = false;
                        }, 4000)
                    }
                }else{
                    $window.location.href = "/birth/list"
                }
            });
        }

    }
}

const name = 'login';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
]).component(name, {
    template,
    controllerAs: name,
    controller: Login
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('login', {
            url: '/login',
            template: '<login></login>',
            //to determine whene this component should be routed 
            resolve: {
                currentUser($q, $window) {
                    if (Meteor.user() === null) {

                    } else {
                        $window.location.href = '/birth/list';
                    }
                }
            }
        })
}