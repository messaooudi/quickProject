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

export const Deces = new Ground.Collection('deces', {
    transform: function (deces) {
        //any transformation to apply to a record of this schema (in this case schemaExempleDocument) can be done here 
        //since this is a shared code between client and server , be careful if some code 
        //runs only on the client side or server side use Meteor.isServer or Meteor.isClient booleans
        return deces;
    }
});


if (Meteor.isServer) {
    Meteor.publish('deces', function (selector, options) {
        if (Meteor.users.findOne({ _id: this.userId }).profile.mask == "010")
            return Deces.find(selector || {}, options || { limit: 30 });
        else
            return Deces.find(selector || {}, { createdBy: this.userId })
    });

    Meteor.publish('decesNew', function (options) {
        console.log(options)
        if (Meteor.users.findOne({ _id: this.userId }).profile.mask == "010")
            return Deces.find({ status: "new" }, options || { limit: 30 });
        else
            return Deces.find({ createdBy: this.userId })
    });

    Meteor.publish('decesProgress', function (options) {
        console.log(options)
        if (Meteor.users.findOne({ _id: this.userId }).profile.mask == "010")
            return Deces.find({ status: "progress" }, options || { limit: 30 });
        else
            return Deces.find({ createdBy: this.userId })
    });
}

Deces.allow({
    insert(userId, deces) {
        return true;//if true the insert is allowed otherwise its denied
    },

    update(userId, deces, fields, modifier) {
        return Meteor.users.findOne({ _id: userId }).profile.mask == "010";//if true the uodate is allowed otherwise its denied
    },
    remove(userId, deces) {
        return Meteor.users.findOne({ _id: userId }).profile.mask == "010";//if true the remove is allowed otherwise its denied
    }
});