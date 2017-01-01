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
    Meteor.publish('graduation', function () {
        if (Meteor.users.findOne({_id : this.userId}).profile.mask == "010")
            return Graduation.find({});
        else 
            return Graduation.find({createdBy : this.userId})
    });

}

Graduation.allow({
    insert(userId, graduation) {
        return true;//if true the insert is allowed otherwise its denied
    },

    update(userId, graduation, fields, modifier) {
        return Meteor.users.findOne({_id : userId}).profile.mask == "010";//if true the uodate is allowed otherwise its denied
    },
    remove(userId, graduation) {
        return Meteor.users.findOne({_id : userId}).profile.mask == "010";//if true the uodate is allowed otherwise its denied
    }
});