import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file 
import { Naissance } from '../../database/naissance';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');

class BirthEdit {
    constructor($scope, $reactive, $stateParams, $location,$timeout) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        Tracker.autorun(() => {
            vm.user = (Meteor.user() || {}).profile;
            if ((vm.user || {}).mask) {
                $timeout(() => {
                    $scope.$apply(function () {
                    });
                }, 100)
            }
        })
        //subscribe to naissance schema

        Meteor.subscribe('naissance');

        vm.birth = Naissance.findOne({ _id: $stateParams.id });
        vm.submit = function () {
            var x = Naissance.update({ _id: vm.birth._id }, {
                $set: {
                    nom: vm.birth.nom,
                    prenom: vm.birth.prenom,
                    nomPere: vm.birth.nomPere,
                    prenomPere: vm.birth.prenomPere,
                    nomMere: vm.birth.nomMere,
                    prenomMere: vm.birth.prenomMere,
                    date: vm.birth.date,
                    adresse: vm.birth.adresse,
                    phoneNumber: vm.birth.phoneNumber,
                    pediatrician: vm.birth.pediatrician,
                    hospital: vm.birth.hospital,
                    status: 'progress'
                }
            });
            $location.path("/birth/list");
            vm.birth = {};
        }

        vm.cancel = function () {
            $location.path("/birth/list");
        }
    }
}

const name = 'birthEdit';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
]).component(name, {
    template,
    controllerAs: name,
    controller: BirthEdit
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('birthedit', {
            url: '/birth/edit/:id',
            template: '<birth-edit></birth-edit>',
            //to determine when this component should be routed 
            resolve: {
                currentUser($q, $window) {
                    if (Meteor.userId()) {
                        Tracker.autorun(() => {
                            if (Meteor.user() && Meteor.user().profile.mask != "010") {
                                $window.location.href = "/home"
                            } else {

                            }
                        })
                    } else {
                        $window.location.href = "/login"
                    }
                }
            }
        })
}