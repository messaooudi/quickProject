import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'



//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './web.html';

import './mobile.css';
import './web.css';

//import modules
import { name as EventCard } from '../eventList/eventList';

class App {
    constructor($scope,$reactive) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;
        /*
            the logic of the component should be encapsuled here 
         */

    }
}

const name = 'app';
const template = Meteor.isCordova ? mobileTemplate:webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    EventCard
]).component(name, {
    template,
    controllerAs: name,
    controller: App
}).config(config); //to set the route config of this Component
function config($locationProvider, $urlRouterProvider) {
    'ngInject';
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/eventlist'); //to set a default route in general used in a global context not in a component
}