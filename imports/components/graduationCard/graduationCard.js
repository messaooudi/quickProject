import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

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
        vm.print = function(){

        }

        vm.remove = function(){
            //hard deletion, might be updated to soft.
            Graduation.remove( this.data._id );
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
        user:"<"
    }
})