import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file 
import { Graduation } from '../../database/graduation';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');


class GraduationEdit {
    constructor($scope,$reactive,$location,$stateParams) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;
        vm.query = {_id:$stateParams.id};

        //subscribe to graduation schema
        Tracker.autorun(() => {
            Meteor.subscribe('graduation', vm.getReactively('query'));
        })

        vm.grad = Graduation.find({}).collection._docs._map[$stateParams.id];
        vm.submit = function () {
            Graduation.update({_id:$stateParams.id},{
                $set:{
                    name:vm.grad.name,
                    prenom:vm.grad.prenom,
                    date:vm.grad.date,
                    phoneNumber:vm.grad.phoneNumber,
                    nomEtabliss:vm.grad.nomEtabliss,
                    specialite:vm.grad.specialite,
                    adresse:vm.grad.adresse,
                    projetPro:vm.grad.projetPro,
                    status:'progress'
                }
            });
            $location.path("/graduation/list");
            vm.grad = {};
        }

        vm.cancel = function () {
            $location.path("/graduation/list");
        }
    }
}

const name = 'graduationEdit';
const template = Meteor.isCordova ? mobileTemplate:webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
]).component(name, {
    template,
    controllerAs: name,
    controller: GraduationEdit
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('graduationedit', {
            url: '/graduation/edit/:id',
            template: '<graduation-edit></graduation-edit>',
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