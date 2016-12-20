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

import './mobile.css';
import './web.css';


//import modules
import { name as EventCard } from '../eventCard/eventCard';

//import Schemas
import { Naissance } from '../../database/naissance';


class EventList {
    constructor($scope, $reactive) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;
        
         Meteor.subscribe('naissance', {});
        vm.helpers({
            naissance() {
                return Naissance.find({})
            }
        });
        /*
            the logic of the component should be encapsuled here 
         */

    }
}

const name = 'eventList';
const template = Meteor.isCordova ? mobileTemplate:webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    EventCard
]).component(name, {
    template,
    controllerAs: name,
    controller: EventList
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('EventList', {
            url: '/eventlist',
            template: '<event-list></event-list>',
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