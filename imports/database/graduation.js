//this is a basic structure of how a database schema should be created
//each time u want to create a new database file u can copy this template
/*
 //you can insert here the structure of the schema
 //in order too have an idea of its fields and there types
 //keep it as a comment :)

 SchemaExemple {
 field1 : type,
 ...
 }
 */

import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Graduation = new Mongo.Collection('graduation', {
    transform: function (graduation) {
        //any transformation to apply to a record of this schema (in this case schemaExempleDocument) can be done here
        //since this is a shared code between client and server , be careful if some code
        //runs only on the client side or server side use Meteor.isServer or Meteor.isClient booleans
        return graduation;
    }
});


if (Meteor.isServer) {
    Meteor.publish('graduation', function (selector) {
        return Graduation.find(selector);
    });

}

Graduation.allow({
    insert(userId, graduation) {
        return true;//if true the insert is allowed otherwise its denied
    },

    update(userId, graduation, fields, modifier) {
        return true;//if true the uodate is allowed otherwise its denied
    },
    remove(userId, graduation) {
        return true;//if true the remove is allowed otherwise its denied
    }
});