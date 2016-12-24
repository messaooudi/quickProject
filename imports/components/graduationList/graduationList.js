import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file
//import { databaseExemple } from '../../database/template';



//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './web.html';

//import './mobile.css';
import './web.css';


//import modules
import { name as GraduationCard } from '../graduationCard/graduationCard';

//import Schemas
import { Graduation } from '../../database/graduation';


class GraduationList {
    constructor($scope, $reactive) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        //subscribe to naissance schema
        Meteor.subscribe('graduation', {});
        vm.helpers({
            graduation() {
                return Graduation.find({})
            }
        });

    }
}

const name = 'graduationList';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    GraduationCard
]).component(name, {
    template,
    controllerAs: name,
    controller: GraduationList
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('graduationlist', {
            url: '/graduationlist',
            template: '<graduation-list></graduation-list>',
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