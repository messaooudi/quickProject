import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

import { name as Drawer } from '../drawer/drawer';
//in order to use any schema u should import its js file 
//import { databaseExemple } from '../../database/template';

//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');

class Header {

    constructor($scope, $reactive, $location, $rootScope) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        vm.label = "";

        vm.moreContainer = {
            _show: false,
            toggle: function () {
                this._show = !this._show;
                $('#more_container').toggleClass("show_more_container");
            }
        }

        vm.moreButton = {
            click: function ($event) {
                vm.moreContainer.toggle();
                $event.stopPropagation();
            }
        }


        vm.plusButton = {
            click: function () {
                if ($location.path().includes("birth"))
                    $location.path("birth/add");
                else if ($location.path().includes("death"))
                    $location.path("death/add");
                else if ($location.path().includes("graduation"))
                    $location.path("graduation/add");
                else if ($location.path().includes("userslist"))
                    $location.path("singup");
            }
        }


        $('body').bind('click', () => {
            $('#more_container').removeClass("show_more_container");
        })

        vm.drawer = {
            toggle: function () {
                $rootScope.$broadcast("TOGGLE_DRAWER");
            }
        }

    }
}

const name = 'header';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: Header,
})