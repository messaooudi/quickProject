import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file 
//import { databaseExemple } from '../../database/template';
import { Graduation } from '../../database/graduation';

import { name as GraduationArchiveCard } from '../graduationArchiveCard/graduationArchiveCard';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');


class GraduationArchive {
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

        Meteor.subscribe('graduation', {});
            
        vm.helpers({
            graduation() {
                let query = Graduation.find({status : 'done'});
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

const name = 'graduationArchive';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    GraduationArchiveCard
]).component(name, {
    template,
    controllerAs: name,
    controller: GraduationArchive
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('graduationarchive', {
            url: '/graduation/archive',
            template: '<graduation-archive></graduation-archive>',
            //to determine whene this component should be routed 
            /*resolve: {
                currentUser($q,$window) {
                    if (Meteor.user() === null) {
                        $window.location.href = '/login';
                    } else {
                        return $q.resolve();
                    }
                }
            }*/
        })
}