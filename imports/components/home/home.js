import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file 
//import { databaseExemple } from '../../database/template';

import { Naissance } from '../../database/naissance';
import { Deces } from '../../database/deces';
import { Graduation } from '../../database/graduation';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');


class Home {
    constructor($scope, $reactive,$timeout) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        Meteor.subscribe('naissance', {});
        Meteor.subscribe('deces', {});
        Meteor.subscribe('graduation', {});
        
        vm.helpers({
            birthCount(){
                return Naissance.find({status : {$ne : "done"}}).count()
            }
        })
        vm.helpers({
           deathCount(){
                return Deces.find({status : {$ne : "done"}}).count()
            }
        })
        vm.helpers({
           graduationCount(){
                return Graduation.find({status : {$ne : "done"}}).count()
            }
        })
        

        Tracker.autorun(() => {
            vm.user = (Meteor.user() || {}).profile;
            if ((vm.user || {}).mask) {
                $timeout(() => {
                    $scope.$apply(function () {
                    });
                }, 100)
            }
        })

        /*
            the logic of the component should be encapsuled here 
         */

    }
}

const name = 'home';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
]).component(name, {
    template,
    controllerAs: name,
    controller: Home
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('home', {
            url: '/home',
            template: '<home></home>',
            //to determine whene this component should be routed 
            resolve: {
                currentUser($q,$window) {
                    if (!Meteor.userId()) {
                        $window.location.href = '/login';
                    } else {
                        return $q.resolve();
                    }
                }
            }
        })
}