import { Meteor } from 'meteor/meteor';
import { Naissance } from '../imports/database/naissance';
import { Deces } from '../imports/database/deces';
import { Graduation } from '../imports/database/graduation';
import '../imports/database/militants';

import { Accounts } from 'meteor/accounts-base'


const fs = require('fs')


const projectPath = "/home/laptop/work/QA/quickProject/";
Meteor.startup(() => {

    if (Meteor.users.find({ "profile.mask": '010' }).count() == 0) {
        Accounts.createUser({
            email: "admin_admin@gmail.com",
            password: "admin_admin",
            profile: {
                firstName: "admin",
                lastName: "admin",
                phone: "",
                mask: '010'
            }
        });
    }

    Meteor.methods({
        _graduationNewCount: function (query) {
            return Graduation.find(query).count();
        },
        _graduationProgCount: function (query) {
            return Graduation.find(query).count();
        },
        _decesNewCount: function (query) {
            return Deces.find(query).count();
        },
        _decesProgCount: function (query) {
            return Deces.find(query).count();
        },
        _naissanceNewCount: function (query) {
            return Naissance.find(query).count();
        },
        _naissanceProgCount: function (query) {
            return Naissance.find(query).count();
        },
        _naissanceCount: function (query) {
            if (Meteor.user().profile.mask == "001")
                query = { $and: [query, { createdBy: Meteor.userId() }] }
            return Naissance.find(query).count();
        },
        _decesCount: function (query) {
            if (Meteor.user().profile.mask == "001")
                query = { $and: [query, { createdBy: Meteor.userId() }] }
            return Deces.find(query).count();
        },
        _graduationCount: function (query) {
            if (Meteor.user().profile.mask == "001")
                query = { $and: [query, { createdBy: Meteor.userId() }] }
            return Graduation.find(query).count();
        },

        _doneGradudationCard: function (ids) {
            Graduation.update({ _id: { $in: ids } }, { $set: { status: "done" } }, { multi: true })
        },
        _doneBirthCard: function (ids) {
            Naissance.update({ _id: { $in: ids } }, { $set: { status: "done" } }, { multi: true })
        },
        _doneDeathCard: function (ids) {
            Deces.update({ _id: { $in: ids } }, { $set: { status: "done" } }, { multi: true })
        },
        // Declaring a method
        _createUser: function (user) {
            if (Meteor.users.findOne({
                "profile.cin": user.profile.cin
            })) {
                throw new Meteor.Error(500, 'user exist', 'user exist');
            } else {
                Accounts.createUser(user);
            }
        },
        _updateUser: function (id, data) {
            Meteor.users.update({ _id: id }, { $set: { profile: data } });
        },

    });

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
