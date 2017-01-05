import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file 
//import { databaseExemple } from '../../database/template';
import { Deces } from '../../database/deces';

import { name as DeathArchiveCard } from '../deathArchiveCard/deathArchiveCard';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');


class DeathArchive {
    constructor($scope, $reactive, $timeout) {
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

        vm.searchQuery = ""
        vm.page = 1;
        vm.count = 0;



        Tracker.autorun(() => {
            vm.page = 1;
            var search = vm.getReactively("searchQuery");
            var dateB = vm.getReactively("searchDate");
            var dateA = new Date();
            if (dateB) {
                dateA.setDate(dateB.getDate() + 1)
            }
            var searchTable = {}
            if (dateB) {
                var searchTable = {
                    $and: [
                        {
                            $or: [
                                { nom: { $regex: search } },
                                { prenom: { $regex: search } },
                                { address: { $regex: search } },
                            ]
                        },
                        { date: { $gte: dateB } },
                        { date: { $lte: dateA } }
                    ]
                }
            } else {
                var searchTable = {
                    $or: [
                        { nom: { $regex: search } },
                        { prenom: { $regex: search } },
                        { adresse: { $regex: search } },
                        {
                            $and: [
                                { date: { $gte: dateB } },
                                { date: { $lte: dateA } }
                            ]
                        }
                    ]

                }
            }

            Meteor.call('_decesCount', searchTable, function (err, data) {
                vm.count = data;
            })

            Meteor.subscribe('deces', searchTable, { skip: 10 * (vm.getReactively("page") - 1), limit: 10 });
        })

        vm.nextPage = function () {
            vm.page++;
        }

        vm.previousPage = function () {
            vm.page = vm.page > 1 ? vm.page - 1 : 1;
        }



        vm.helpers({
            deces() {
                let query = Deces.find({ status: 'done' });
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

const name = 'deathArchive';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
    DeathArchiveCard
]).component(name, {
    template,
    controllerAs: name,
    controller: DeathArchive
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('deatharchive', {
            url: '/death/archive',
            template: '<death-archive></death-archive>',
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