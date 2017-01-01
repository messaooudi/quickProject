import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'



//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';


Meteor.isCordova ? require('./mobile.css') : require('./web.css');

//import modules
import { name as Header } from '../header/header';
import { name as BirthList } from '../birthList/birthList';
import { name as DeathList } from '../deathList/deathList';
import { name as GraduationList } from '../graduationList/graduationList';
import { name as BirthAdd } from '../birthAdd/birthAdd';
import { name as BirthEdit } from '../birthEdit/birthEdit';
import { name as DeathAdd } from '../deathAdd/deathAdd';
import { name as DeathEdit } from '../deathEdit/deathEdit';
import { name as Login } from '../login/login';
import { name as GraduationAdd } from '../graduationAdd/graduationAdd';
import { name as Drawer } from '../drawer/drawer';
import { name as UsersList } from '../usersList/usersList';
import { name as DeathArchive } from '../deathArchive/deathArchive';


import { name as SingUp } from '../singUp/singUp';

class App {
    constructor($scope, $reactive, $window,$timeout) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;
        vm.loggedIn = false;


        Tracker.autorun(() => {
            if (Meteor.user() === null)
                vm.loggedIn = false;
            else
                vm.loggedIn = true;
        })
        /*
        the logic of the component should be encapsuled here 
     */
    }
}

const name = 'app';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    Header,
    Drawer,
    BirthList,
    BirthEdit,
    DeathList,
    GraduationList,
    BirthAdd,
    DeathAdd,
    DeathEdit,
    Login,
    GraduationAdd,
    UsersList,
    SingUp,
    DeathArchive
]).component(name, {
    template,
    controllerAs: name,
    controller: App
}).config(config); //to set the route config of this Component
function config($locationProvider, $urlRouterProvider) {
    'ngInject';
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/birth/list'); //to set a default route in general used in a global context not in a component
}