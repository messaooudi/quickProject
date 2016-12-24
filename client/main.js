import angular from 'angular';
import { Meteor } from 'meteor/meteor';


import '/public/CDN/font-awesome/css/font-awesome.min.css'
import '/public/CDN/bootstrap/css/bootstrap.min.css'

import './index.css';

import { name as App } from '../imports/components/app/app';


Meteor.startup(function () {
    $.getScript('CDN/bootstrap/js/bootstrap.min.js', function () {
        // script should be loaded and do something with it. 

    });
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