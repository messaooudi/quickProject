import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

import Mustache from 'mustache';
import pdfTemplate from './pdfTemplate.html'


//in order to use any schema u should import its js file 
//import { databaseExemple } from '../../database/template';



//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';


Meteor.isCordova ? require('./mobile.css') : require('./web.css');

//import modules
import { name as DeathCard } from '../deathCard/deathCard';

//import Schemas
import { Deces } from '../../database/deces';


class DeathList {
    constructor($scope, $reactive, $timeout,$interval) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        vm.intervalTimer;
        vm.printTimer = 5;

        vm.pdfPrint = function (data) {
            if (vm.printTimer < 5) {
                var w = window.open();
                w.document.write(Mustache.to_html(pdfTemplate, data));
                w.print();
                w.close();
                Meteor.call('_doneDeathCard', function (error, success) {
                    if (error) {
                        console.log('error', error);
                    }
                    if (success) {

                    }
                });
                vm.printTimer = 5;
                $interval.cancel(vm.intervalTimer);
            } else {
                vm.printTimer = 4;
                vm.intervalTimer = $interval(() => {
                    vm.printTimer--;
                    if (vm.printTimer == 0) {
                        $interval.cancel(vm.intervalTimer);
                        vm.printTimer = 5;
                    }
                }, 1000)
            }
        }

        Tracker.autorun(() => {
            vm.user = (Meteor.user() || {}).profile;
            if (vm.user) {
                $timeout(() => {
                    $scope.$apply(function () {
                    });
                }, 100)
            }
        })

        //subscribe to deces schema
        Meteor.subscribe('deces', {},{});

        vm.helpers({
            deces() {
                let query = Deces.find({ status: { $ne: 'done' } });
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

    }
}

const name = 'deathList';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    DeathCard
]).component(name, {
    template,
    controllerAs: name,
    controller: DeathList
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('deathlist', {
            url: '/death/list',
            template: '<death-list></death-list>',
            //to determine whene this component should be routed 
            resolve: {
                currentUser($q, $window) {
                    if (!Meteor.userId()) {
                        $window.location.href = '/login';
                    } else {
                        return $q.resolve();
                    }
                }
            }
        })
}