import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'



//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './web.html';

//import './mobile.css';
import './web.css';

//import modules
import { name as Header } from '../header/header';
import { name as BirthList } from '../birthList/birthList';
import { name as DeathList } from '../deathList/deathList';
import { name as GraduationList } from '../graduationList/graduationList';
import { name as BirthAdd } from '../birthAdd/birthAdd';
import { name as DeathAdd } from '../deathAdd/deathAdd';

import { name as Drawer } from '../drawer/drawer';
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
    Header,
    Drawer,
    BirthList,
    DeathList,
    GraduationList,
    BirthAdd,
    DeathAdd
]).component(name, {
    template,
    controllerAs: name,
    controller: App
}).config(config); //to set the route config of this Component
function config($locationProvider, $urlRouterProvider) {
    'ngInject';
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
}