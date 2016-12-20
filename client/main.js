import angular from 'angular';
import { Meteor } from 'meteor/meteor';


import '/public/CDN/angular-notify/css/angular-notify.min.css'
import '/public/CDN/bootstrap/css/bootstrap.min.css'
import '/public/CDN/font-awesome/css/font-awesome.min.css'


Meteor.startup(function () {
    $.getScript('CDN/bootstrap/js/bootstrap.min.js', function () {
        // script should be loaded and do something with it. 
    });
});


function onReady() {
    angular.bootstrap(document,[/*dependencies*/], {
            strictDi: true
        });
}

if (Meteor.isCordova) {
    angular.element(document).on('deviceready', onReady);
} else {
    angular.element(document).ready(onReady);
}