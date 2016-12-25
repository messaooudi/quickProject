import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file
//import { databaseExemple } from '../../database/template';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');

//import Schemas
import { Graduation } from '../../database/graduation';

class GraduationAdd {
    constructor($scope, $reactive, $location) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        vm.graduation = {};

        vm.submit = function () {
            var WriteResult = Graduation.insert({
                name: vm.graduation.name
            });

            if (!WriteResult)
                alert("prob d'insertion")
            $location.path('/graduation/list');
            vm.reset();
        }
        vm.cancel = function () {
            $location.path('/graduation/list');
            vm.reset();
        }
        vm.reset = function () {
            vm.naissance = {};

        }
    }
}

const name = 'graduationAdd';

const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
]).component(name, {
    template,
    controllerAs: name,
    controller: GraduationAdd
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component

    $stateProvider
        .state('graduationadd', {
            url: '/graduation/add',
            template: '<graduation-add></graduation-add>',
            //to determine whene this component should be routed
            /*resolve: {
             currentUser($q) {
             if (condition) {
             return $q.reject();
             } else {
             return $q.resolve();
             }
             }
             }*/
        })
}