import { Meteor } from 'meteor/meteor';
import { Naissance } from '../imports/database/naissance';
import { Deces } from '../imports/database/deces';
import { Graduation } from '../imports/database/graduation';
import { Accounts } from 'meteor/accounts-base'


const fs = require('fs')
const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');

const projectPath = "/home/oussama/Projects/quickProject/";
Meteor.startup(() => {

    if (Naissance.find().count() == 0) {
        for (var i = 0; i < 5; i++) {
            Naissance.insert({ name: "nom " + i });
        }
    }
    if (Deces.find().count() == 0) {
        for (var i = 0; i < 3; i++) {
            Deces.insert({ name: "nom " + i });
        }
    }
    if (Graduation.find().count() == 0) {
        for (var i = 0; i < 3; i++) {
            Graduation.insert({ name: "nom " + i });
        }
    }

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

    try { fs.mkdirSync(projectPath + "generatedDocuments"); } catch (err) { }
    try { fs.mkdirSync(projectPath + "generatedDocuments/birth"); } catch (err) { }
    try { fs.mkdirSync(projectPath + "generatedDocuments/death"); } catch (err) { }
    try { fs.mkdirSync(projectPath + "generatedDocuments/graduation"); } catch (err) { }

    /*
    code to run on server at startup
    */

    Meteor.methods({
        // Declaring a method
        generateBirthDOCX: function (data) {
            try {
                generateDocx("birth/template.docx", "birth/", "naissance_", data)
            } catch (exception) {
                throw new Meteor.Error("docxError", "exception");
            }
            return "ok";
        },
        generateDeathDOCX: function (data) {
            try {
                generateDocx("death/template.docx", "death/", "deces_", data)
            } catch (exception) {
                throw new Meteor.Error("docxError", "exception");
            }
        },
        generateGraduationDOCX: function (data) {
            try {
                generateDocx("graduation/template.docx", "graduation/", "graduation_", data)
            } catch (exception) {
                throw new Meteor.Error("docxError", "exception");
            }
        }
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


function generateDocx(pathToTemplate, outPath, prefix, data) {
    var template = fs
        .readFileSync(projectPath + "server/templatesDOCX/" + pathToTemplate, "binary")

    var zip = new JSZip(template);

    var doc = new Docxtemplater();
    doc.loadZip(zip);

    doc.setData(data);

    doc.render();

    var buf = doc.getZip()
        .generate({ type: "nodebuffer" });

    var date = new Date();
    var dirName = date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay() + "/";
    try {
        fs.mkdirSync(projectPath + "generatedDocuments/" + outPath + dirName);
    } catch (exception) {

    }

    fs.writeFileSync(projectPath + "generatedDocuments/" + outPath + dirName + prefix + data._id + ".docx", buf);
};
