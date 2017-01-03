import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file 
//import { databaseExemple } from '../../database/template';
import { Naissance } from '../../database/naissance';

import { name as BirthArchiveCard } from '../birthArchiveCard/birthArchiveCard';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');


class BirthArchive {
    constructor($scope, $reactive,$timeout) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        Tracker.autorun(() => {
            vm.user = (Meteor.user() || {}).profile;
            if (vm.user) {
                $timeout(() => {
                    $scope.$apply(function () {
                    });
                }, 100)
            }
        })

        Meteor.subscribe('naissance', {});
            
        vm.helpers({
            naissance() {
                let query = Naissance.find({status : 'done'});
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
                        if (query.count() == count) {
                            $(loadingCube).addClass('hide-loading-cube');
                        }
                    }
                })
                return query
            }
        });

        /*
            the logic of the component should be encapsuled here 
         */

    }
}

const name = 'birthArchive';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    BirthArchiveCard
]).component(name, {
    template,
    controllerAs: name,
    controller: BirthArchive
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('birtharchive', {
            url: '/birth/archive',
            template: '<birth-archive></birth-archive>',
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