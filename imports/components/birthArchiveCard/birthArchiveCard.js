import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

import Mustache from 'mustache';
import pdfTemplate from './pdfTemplate.html'

//in order to use any schema u should import its js file 


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');

class BirthArchiveCard {
    constructor($scope, $reactive, $stateParams) {
        'ngInject';
        $reactive(this).attach($scope);

        var vm = this;

        vm.pdfPrint = function () {
            var w = window.open();
            w.document.write(Mustache.to_html(pdfTemplate, vm.data));
            w.print();
            w.close();
        }

        //print the birthCard
        vm.print = function () {
            vm.pdfPrint();
        }
    }
}

const name = 'birthArchiveCard';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: BirthArchiveCard,
    bindings: {
        data: "<",
        user: "<"
    }
})