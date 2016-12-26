import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file 
import { Naissance } from '../../database/naissance';


//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

Meteor.isCordova ? require('./mobile.css') : require('./web.css');


class BirthCard {
    constructor($scope,$reactive,$stateParams) {
        'ngInject';
        $reactive(this).attach($scope);
        
        var vm = this;

        //print the birthCard
        vm.print = function(){
            
        }

        vm.remove = function(){
            //hard deletion, might be updated to soft.
            Naissance.update({_id:this.data._id},{$set:{processed:true}});
        }

    }
}

const name = 'birthCard';
const template = Meteor.isCordova ? mobileTemplate:webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
    uiRouter
]).component(name, {
    template,
    controllerAs: name,
    controller: BirthCard,
    bindings : {
        data : "<"
    }
})