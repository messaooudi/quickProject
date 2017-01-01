import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file 
import { Deces } from '../../database/deces';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');


class DeathEdit {
    constructor($scope,$reactive,$location,$stateParams) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;
        vm.query = {_id:$stateParams.id};

        //subscribe to deces schema
        Tracker.autorun(() => {
            Meteor.subscribe('deces', vm.getReactively('query'));
        })
        
        vm.decee = Deces.find({}).collection._docs._map[$stateParams.id];
        vm.submit = function () {
            Deces.update({_id:$stateParams.id},{
                $set:{
                    address:vm.decee.address,
                    childrenNbr:vm.decee.childrenNbr,
                    date:vm.decee.date,
                    gender:vm.decee.gender,
                    nom:vm.decee.nom,
                    prenom:vm.decee.prenom,
                    status:'progress'
                }
            });
            $location.path("/death/list");
            vm.decee = {};
        }

        vm.cancel = function () {
            $location.path("/death/list");
        }
    }
}

const name = 'deathEdit';
const template = Meteor.isCordova ? mobileTemplate:webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
]).component(name, {
    template,
    controllerAs: name,
    controller: DeathEdit
}).config(config); //to set the route config of this Component
function config($locationProvider, $stateProvider, $urlRouterProvider) {
    'ngInject';
    //$locationProvider.html5Mode(true);
    //$urlRouterProvider.otherwise('/'); //to set a default route in general used in a global context not in a component
    $stateProvider
        .state('deathedit', {
            url: '/death/edit/:id',
            template: '<death-edit></death-edit>',
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