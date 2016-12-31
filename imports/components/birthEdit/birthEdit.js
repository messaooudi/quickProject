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
    constructor($scope,$reactive,$rootScope,$stateParams,$location) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;
        vm.query = {_id : $stateParams.id};
        //subscribe to naissance schema
        Tracker.autorun(() => {
            Meteor.subscribe('naissance', vm.getReactively('query'));
        })
        vm.birth = Naissance.find({}).collection._docs._map[$stateParams.id];    
        console.log(vm.birth)  // FIXME

        vm.submit = function () {
            var x = Naissance.update({_id:vm.birth._id},{ 
                $set: {
                    firstName:vm.birth.firstName,
                    lastName:vm.birth.lastName,
                    fatherFName:vm.birth.fatherFName,
                    fatherLName:vm.birth.fatherLName,
                    motherFName:vm.birth.motherFName,
                    motherLName:vm.birth.motherLName,
                    date:vm.birth.date,
                    address:vm.birth.address,
                    phone:vm.birth.phone,
                }
            });
            $location.path("/birth/list");
        }

        vm.cancel = function () {
            $location.path("/birth/list");
        }  
    }
}

const name = 'birthEdit';
const template = Meteor.isCordova ? mobileTemplate:webTemplate;
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