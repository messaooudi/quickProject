import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

import Mustache from 'mustache';
import pdfTemplate from './pdfTemplate.html'

//in order to use any schema u should import its js file 
import { Naissance } from '../../database/naissance';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');


class BirthCard {
    constructor($scope, $reactive) {
        'ngInject';
        $reactive(this).attach($scope);

        var vm = this;
        vm.createdBy = {}

        Meteor.subscribe('militants', {});
        vm.helpers({
            createdBy() {
                if (vm.getReactively('data', true)) {
                    return (Meteor.users.findOne({ _id: vm.data.createdBy })||{}).profile
                }
                    return {};
            }
        })


        vm.pdfPrint = function () {
            var w = window.open();
            w.document.write(Mustache.to_html(pdfTemplate, vm.data));
            w.print();
            w.close();
        }

        vm.print = function () {
            vm.pdfPrint();
            Naissance.update({ _id: vm.data._id }, {
                $set: {
                    status: 'done'
                }
            });
        }
    }
}

const name = 'birthCard';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: BirthCard,
    bindings: {
        data: "<",
        user: "<"
    }
})