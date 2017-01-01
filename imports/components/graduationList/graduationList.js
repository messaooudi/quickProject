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
    constructor($scope, $reactive, $timeout) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        vm.pdfPrint = function (data) {
            var w = window.open();
            w.document.write(Mustache.to_html(pdfTemplate, data));
            w.print();
            w.close();
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

        //subscribe to graduation schema
        Meteor.subscribe('graduation',{});

        vm.helpers({
            graduation() {
                let query = Graduation.find({status : {$ne : 'done'}});
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
                    if (Meteor.user() === null) {
                        $window.location.href = '/login';
                    } else {
                        return $q.resolve();
                    }
                }
            }
        })
}