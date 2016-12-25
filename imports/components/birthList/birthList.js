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



//import modules
import { name as BirthCard } from '../birthCard/birthCard';

//import Schemas
import { Naissance } from '../../database/naissance';


class BirthList {
    constructor($scope, $reactive) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        //subscribe to naissance schema
        Meteor.subscribe('naissance', {});
        vm.helpers({
            naissance() {
                let query = Naissance.find({});
                let count = 0;
                let loadingCube = $('#loading-cube');
                query.observeChanges({
                    added: function (id, formation) {
                        count++;
                        if (query.count() == count) {
                            $(loadingCube).addClass('hide-loading-cube');
                        } else {
                            $(loadingCube).removeClass('hide-loading-cube');
                        }
                    },
                    changed: function (id, formation) {
                    },
                    removed: function (id) {
                        count--;
                    }
                })
                return query
            }
        });

        vm.text = "";
        vm.submit = function () {
            Naissance.insert({ name: vm.text });
        }
    }
}

const name = 'birthList';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    BirthCard
]).component(name, {
    template,
    controllerAs: name,
    controller: BirthList
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('birthlist', {
            url: '/birth/list',
            template: '<birth-list></birth-list>',
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