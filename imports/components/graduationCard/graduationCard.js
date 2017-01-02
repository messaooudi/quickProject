import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

import Mustache from 'mustache';
import pdfTemplate from './pdfTemplate.html'

//in order to use any schema u should import its js file
import { Graduation } from '../../database/graduation';


//in order to use any schema u should import its js file
//import { databaseExemple } from '../../database/template';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');



class GraduationCard {
    constructor($scope,$reactive,$stateParams) {
        'ngInject';
        $reactive(this).attach($scope);

        var vm = this;

        //print the graduationCard
        vm.pdfPrint = function () {
            var w = window.open();
            //w.document.write(Mustache.to_html(pdfTemplate, { title: "test" }));
            w.print();
            w.close();
        }

        vm.print = function () {
            vm.pdfPrint();
            Meteor.call('generateGraduationDOCX', vm.data, function (err, data) {
                if (err) {
                    alert(err);
                } else {
                    alert("document créé ")
                }
            });

            Graduation.update({ _id: vm.data._id }, {
                $set: {
                    status: 'done'
                }
            });
        }
    }
}

const name = 'graduationCard';
const template = Meteor.isCordova ? mobileTemplate:webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: GraduationCard,
    bindings : {
        data : "<",
        user : "<"
    }
})