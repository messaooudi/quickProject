import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file 
//import { databaseExemple } from '../../database/template';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');


class UserCard {
    constructor($scope, $reactive, $interval, $timeout) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        vm.submitInProgress = false;
        var dataBackUp = {};
        var userExist = false;

        vm.intervalTimer;
        vm.deleteTimer = 5;

        vm.removeButton = {
            _show: true
        }

        vm.updateButton = {
            _show: true,
            mask: "001"//show update
        }

        vm.update = function () {
            vm.dataBackUp = angular.copy(vm.data);
            vm.removeButton._show = false;
            vm.updateButton.mask = "010"
            vm.deleteTimer = 5;
            $interval.cancel(vm.intervalTimer);
        }

        vm.confirmUpdate = function () {
            vm.submitInProgress = true;
            Meteor.call('_updateUser', vm.data._id, vm.data.profile, function (err, data) {
                $scope.$apply(() => {
                    if (err) {
                        if (err.reason == "user exist") {
                            vm.userExist = true;
                            $timeout(function () {
                                vm.userExist = false;
                            }, 4000)
                        }
                    } else {
                        vm.removeButton._show = true;
                        vm.updateButton.mask = "001"
                        vm.dataBackUp = {};
                    }
                    vm.submitInProgress = false;
                });
            })
        }

        vm.cancelUpdate = function () {
            vm.data = angular.copy(vm.dataBackUp);
            vm.removeButton._show = true;
            vm.updateButton.mask = "001"
        }

        vm.submitRemove = function () {
            Meteor.users.remove({ _id: vm.data._id })
            $interval.cancel(vm.intervalTimer);
            vm.deleteTimer = 5;
            vm.updateButton._show = true;
        }
        vm.remove = function () {
            vm.updateButton._show = false;//hide update button
            vm.deleteTimer = 4;
            vm.intervalTimer = $interval(() => {
                vm.deleteTimer--;
                if (vm.deleteTimer == 0) {
                    $interval.cancel(vm.intervalTimer);
                    vm.deleteTimer = 5;
                    vm.updateButton._show = true;
                }
            }, 1000)

        }

        /*
            the logic of the component should be encapsuled here 
         */

    }
}

const name = 'userCard';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
]).component(name, {
    template,
    controllerAs: name,
    controller: UserCard,
    bindings: {
        data: '<',
    }
})