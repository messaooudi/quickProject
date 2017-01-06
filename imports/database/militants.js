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

Ground.Collection(Meteor.users);

if (Meteor.isServer) {
    Meteor.publish('militants', function () {
        if (Meteor.users.findOne({ _id: this.userId }).profile.mask == "010")
            return Meteor.users.find({ 'profile.mask': { $ne: "010" } }, { fields: { profile: 1 } });
    });

}

Meteor.users.allow({
    insert(userId, naissance) {
        return Meteor.users.findOne({ _id: userId }).profile.mask == "010";
    },

    update(userId, naissance, fields, modifier) {
        return Meteor.users.findOne({ _id: userId }).profile.mask == "010";
    },
    remove(userId, naissance) {
        return Meteor.users.findOne({ _id: userId }).profile.mask == "010";//if true the remove is allowed otherwise its denied
    }
});