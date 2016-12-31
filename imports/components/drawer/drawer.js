import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file 
//import { databaseExemple } from '../../database/template';

//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');



class Drawer {
    constructor($scope, $reactive,$window,$timeout) {
        'ngInject';

        $reactive(this).attach($scope);
        
        var vm = this;
        vm.user = {
            profile:{
                mask : '001'
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

        vm.state = false;
        vm.toggle = function () {
            vm.state = !vm.state;
        }

        vm.logout = function () {
            /*again pour le test hh 
            mais cette fonctin assure le logout donc use it as free of charge :D */
            Meteor.logout(function (error) {
                if (error)
                    alert(error)
               $window.location.href='/login';
            })
        }

        $scope.$on("TOGGLE_DRAWER", function () {
            vm.toggle();
        });
    }
}
const name = 'drawer';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
]).component(name, {
    template,
    controllerAs: name,
    controller: Drawer
})
