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

export const Naissance = new Ground.Collection('naissance', {
    transform: function (naissance) {
        //any transformation to apply to a record of this schema (in this case schemaExempleDocument) can be done here 
        //since this is a shared code between client and server , be careful if some code 
        //runs only on the client side or server side use Meteor.isServer or Meteor.isClient booleans
        return naissance;
    }
});


if (Meteor.isServer) {
    Meteor.publish('naissance', function (selector, options) {
        console.log(options)
        if (Meteor.users.findOne({ _id: this.userId }).profile.mask == "010")
            return Naissance.find(selector || {}, options || { limit: 30 });
        else
            return Naissance.find({ createdBy: this.userId })
    });

    Meteor.publish('naissanceNew', function (options) {
        console.log(options)
        if (Meteor.users.findOne({ _id: this.userId }).profile.mask == "010")
            return Naissance.find({ status: "new" }, options || { limit: 30 });
        else
            return Naissance.find({ createdBy: this.userId })
    });

    Meteor.publish('naissanceProgress', function (options) {
        console.log(options)
        if (Meteor.users.findOne({ _id: this.userId }).profile.mask == "010")
            return Naissance.find({ status: "progress" }, options || { limit: 30 });
        else
            return Naissance.find({ createdBy: this.userId })
    });
}

Naissance.allow({
    insert(userId, naissance) {
        return true;//if true the insert is allowed otherwise its denied
    },

    update(userId, naissance, fields, modifier) {
        return Meteor.users.findOne({ _id: userId }).profile.mask == "010";//if true the uodate is allowed otherwise its denied
    },
    remove(userId, naissance) {
        return Meteor.users.findOne({ _id: userId }).profile.mask == "010";//if true the uodate is allowed otherwise its denied
    }
});