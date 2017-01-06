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
import { name as GraduationCard } from '../graduationCard/graduationCard';

//import Schemas
import { Graduation } from '../../database/graduation';


class GraduationList {
    constructor($scope, $reactive, $timeout, $interval) {
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
                var ids = [];
                vm.graduationProgress.forEach(function (n) {
                    ids.push(n._id);
                }, )
                Meteor.call('_doneGradudationCard', ids, function (error, success) {
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
            if ((vm.user || {}).mask) {
                $timeout(() => {
                    $scope.$apply(function () {
                    });
                }, 100)
            }
        })



        vm.pagiNew = {};
        vm.pagiNew.page = 1;
        vm.pagiNew.count = 0;

        Tracker.autorun(() => {
            Meteor.call('_graduationNewCount', { status: "new" }, function (err, data) {
                vm.pagiNew.count = data;
            })

            Meteor.subscribe('graduationNew', { skip: 10 * (vm.getReactively("pagiNew.page", true) - 1), limit: 10 });
        })


        vm.pagiNew.nextPage = function () {
            vm.pagiNew.page++;
        }

        vm.pagiNew.previousPage = function () {
            vm.pagiNew.page = vm.pagiNew.page > 1 ? vm.pagiNew.page - 1 : 1;
        }


        /****************************************************** */

        vm.pagiProg = {};
        vm.pagiProg.page = 1;
        vm.pagiProg.count = 0;

        Tracker.autorun(() => {
            Meteor.call('_graduationProgCount', { status: "progress" }, function (err, data) {
                vm.pagiProg.count = data;
            })

            Meteor.subscribe('graduationProgress', { skip: 10 * (vm.getReactively("pagiProg.page") - 1), limit: 10 });
        })

        vm.pagiProg.nextPage = function () {
            vm.pagiProg.page++;
        }

        vm.pagiProg.previousPage = function () {
            vm.pagiProg.page = vm.pagiProg.page > 1 ? vm.pagiProg.page - 1 : 1;
        }


        Meteor.subscribe('graduationNew', {});

        vm.helpers({
            graduationNew() {
                let query = Graduation.find({ status: 'new' });
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
                });
                return query
            }
        });

        vm.helpers({
            graduationProgress() {
                let query = Graduation.find({ status: 'progress' });
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
                });
                return query
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
            url: '/graduation/list',
            template: '<graduation-list></graduation-list>',
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