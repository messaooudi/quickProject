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

//import './mobile.css';
import './web.css';

//import Schemas
import { Deces } from '../../database/deces';

class DeathAdd {
    constructor($scope, $reactive, $location) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        vm.decee = {};

        vm.submit = function () {
            var WriteResult = Deces.insert({
                name: vm.decee.name
            });

            if (!WriteResult)
                alert("prob d'insertion")
            $location.path('/death/list');
            vm.reset();
        }
        vm.cancel = function () {
            $location.path('/death/list');
            vm.reset();
        }
        vm.reset = function () {
            vm.decee = {};
        }
    }
}

const name = 'deathAdd';

const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
]).component(name, {
    template,
    controllerAs: name,
    controller: DeathAdd
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('deathadd', {
            url: '/death/add',
            template: '<death-add></death-add>',
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