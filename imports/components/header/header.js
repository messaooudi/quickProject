import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file 
//import { databaseExemple } from '../../database/template';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './web.html';

//import './mobile.css';
import './web.css';


class Header {
    constructor($scope, $reactive,$location) {
        'ngInject';
        $reactive(this).attach($scope);
        var vm = this;

        vm.moreContainer = {
            toggle: function () {
                $('#more_container').toggleClass("show_more_container");
            },
            itemClick : function(path){
                this.toggle();
                $location.path(path);

            }
        }

        vm.moreButton = {
            click: function () {
                vm.moreContainer.toggle();
            }
        }
        /*
            the logic of the component should be encapsuled here 
         */

    }
}

const name = 'header';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter,
]).component(name, {
    template,
    controllerAs: name,
    controller: Header
})