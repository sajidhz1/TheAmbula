/**
 * Created by Dulitha RD on 12/17/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Reports = new Mongo.Collection('reports');

var Schemas = {};

Schemas.reports = new SimpleSchema({
    reportedItemId: {
        type: String,
        label: "Reporting Item Id"
    },
    reportCategory: {
        type: String,
        label: "Report type"
    },
    description: {
        type: String,
        label: "Description about the report",
        optional: true,
        max: 250,
        min: 50
    },
    userID: {
        type: String,
        label: "User Id"
    },
    reportResolved: {
        type: Boolean,
        label: "Report status",
        defaultValue: false
    },
    createdAt: {
        type: Date,
        label: 'Date of heart added'
    }
});

Reports.attachSchema(Schemas.reports);

Meteor.methods({

    'addNewReport': function (report) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
            //return false;
        }
        return Reports.insert(report, {reportValidationContext: 'reportForm'});
    },

    'reportExistForUser': function (reportItemId) {
        check(reportItemId, String);

        var report = Reports.findOne({reportedItemId: reportItemId, userID: this.userId});

        if (report) {
            return true;
        } else {
            return false;
        }
    }

});