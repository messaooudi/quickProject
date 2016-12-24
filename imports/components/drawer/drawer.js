import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'


//in order to use any schema u should import its js file 
//import { databaseExemple } from '../../database/template';

//import html and css files of this component
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

import './mobile.css';
import './web.css';


class Drawer {
    constructor($scope,$reactive) {
        'ngInject';

        $reactive(this).attach($scope);
        var vm = this;
        vm.state = "";
        vm.toggle = function(){
             if(vm.state === "hidden"){
                vm.state = "shown";
            }else{
                vm.state = "hidden";
            }
        }
    }
}
const name = 'drawer';
const template = Meteor.isCordova ? mobileTemplate:webTemplate;
//create a module
export default angular.module(name, [
    angularMeteor,
]).component(name, {
    template,
    controllerAs: name,
    controller: Drawer
})
