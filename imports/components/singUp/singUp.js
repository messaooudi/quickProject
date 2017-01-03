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


class SingUp {
    constructor($scope, $reactive, $timeout, $window, $location) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;


        vm.userExist = false;
        vm.submitInProgress = false;
        vm.singUp = {
            firstName: '',
            lastName: '',
            phone: '',
            cin: '',
            address: '',
            mask: '001'
        }
        vm.createUser = function () {
            vm.submitInProgress = true;
            let user = {
                email: vm.singUp.firstName + "_" + vm.singUp.lastName + vm.singUp.cin + "@gmail.com",
                password: vm.singUp.cin,
                profile: {
                    firstName: vm.singUp.firstName.toUpperCase(),
                    lastName: vm.singUp.lastName,
                    cin: vm.singUp.cin.toUpperCase(),
                    phone: vm.singUp.phone,
                    address: vm.singUp.address,
                    mask: '001'
                }
            };
            Meteor.call('_createUser', user, function (err, data) {
                $scope.$apply(() => {
                    if (err) {
                        if (err.reason == "user exist") {
                            vm.userExist = true;
                            $timeout(function () {
                                vm.userExist = false;
                            }, 4000)
                        }
                    } else {
                        vm.singUp = {};
                        //$window.location.href = "/userslist"
                        $location.path('/userslist')
                    }
                    vm.submitInProgress = false;
                });
            });
        }

    }
}

const name = 'singUp';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
]).component(name, {
    template,
    controllerAs: name,
    controller: SingUp
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    $stateProvider
        .state('singup', {
            url: '/singup',
            template: '<sing-up></sing-up>',
            //to determine whene this component should be routed 
            resolve: {
                function() {
                    if (Meteor.userId()) {
                        var user = Meteor.users.find({ _id: Meteor.userId() });
                        
                    }
                }
            }
        })
}