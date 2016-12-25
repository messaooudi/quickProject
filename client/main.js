import angular from 'angular';
import { Meteor } from 'meteor/meteor';


import '/public/CDN/font-awesome/css/font-awesome.min.css'
import '/public/CDN/bootstrap/css/bootstrap.min.css'

import './index.css';

import { name as App } from '../imports/components/app/app';


Meteor.startup(function () {

});


function onReady() {
    angular.bootstrap(document, [
        App
    ], {
            strictDi: true
        });
}

if (Meteor.isCordova) {
    angular.element(document).on('deviceready', onReady);
} else {
    angular.element(document).ready(onReady);
}