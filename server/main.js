import { Meteor } from 'meteor/meteor';

//in order to use any schema u should import its js file 
//import { databaseExemple } from '../imports/database/template';
import { Naissance } from '../imports/database/naissance';
import { Deces } from '../imports/database/deces';


Meteor.startup(() => {
    /*
    code to run on server at startup
    */


    /*
    //if u want to call a methode from the client side u should declare it as follow 
    // in the client side u can call it as follow :
    // Meteor.call('methodName',arg0,arg1...,callback);
    
    Meteor.methods({
        // Declaring a method
        methodName: function (attribute) {
            //do ur magic
        },

        secondMethod: function (attribute) {
            //do ur magic
        }
    });

    */
});
