import { Meteor } from 'meteor/meteor';

//in order to use any schema u should import its js file 
//import { databaseExemple } from '../imports/database/template';
import { Naissance } from '../imports/database/naissance';
import { Deces } from '../imports/database/deces';
import { Graduation } from '../imports/database/graduation';


Meteor.startup(() => {
    
    if(Naissance.find().count()==0){
        for(var i=0;i<5;i++){
            Naissance.insert({name : "nom "+i});
        }
    }
     if(Deces.find().count()==0){
        for(var i=0;i<3;i++){
            Deces.insert({name : "nom "+i});
        }
    }

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
