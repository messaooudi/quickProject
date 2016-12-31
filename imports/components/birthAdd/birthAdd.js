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
import { Naissance } from '../../database/naissance';

class BirthAdd {
    constructor($scope, $reactive, $location) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        vm.naissance = {};

        vm.submit = function () {
            var WriteResult = Naissance.insert({
                firstName: vm.naissance.name,
                lastName: vm.naissance.prenom,
                fatherFName:vm.naissance.nomPere,
                fatherLName:vm.naissance.prenomPere,
                motherFName:vm.naissance.nomMere,
                motherLName:vm.naissance.prenomMere,
                phone:vm.naissance.phoneNumber,
                date:vm.naissance.date,
                address:vm.naissance.adresse,
                createdBy : Meteor.userId(),
                processed:false
            });

            if (!WriteResult)
                alert("prob d'insertion")
            
            $location.path('/birth/list');
            vm.reset();
            $('#thanks').modal('show');
            
        }
        vm.cancel = function () {
            $location.path('/birth/list');
            vm.reset();
        }
        vm.reset = function () {
            vm.naissance = {};
        }
    }
}

const name = 'birthAdd';

const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
]).component(name, {
    template,
    controllerAs: name,
    controller: BirthAdd
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('birthadd', {
            url: '/birth/add',
            template: '<birth-add></birth-add>',
            //to determine whene this component should be routed
            resolve: {
                currentUser($q,$window) {
                    if (Meteor.user() === null) {
                        $window.location.href = '/login';
                    } else {
                        return $q.resolve();
                    }
                }
            }
        })
}