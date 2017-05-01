/**
 * Created by Dulitha RD on 12/4/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {check} from 'meteor/check';
import {ReactiveVar} from 'meteor/reactive-var';
import {Reports} from '../../api/reports.js';

import './postreportdialogbox.html';

Template.postReportDialogBox.onCreated(function bodyOnCreated() {
    this.reportOptionsVar = new ReactiveVar(false);
    this.descriptionVisibleVar = new ReactiveVar(false);
});

Template.postReportDialogBox.events({
    'change [name=report_category]': function (event, template) {
        if (event.currentTarget.value == "something-else") {
            template.reportOptionsVar.set(true);
        } else {
            template.reportOptionsVar.set(false);
        }
    },

    'click .__cancel': function (e, t) {
        Modal.hide('postReportDialogBox');
    },

    'click #continueBtn': function (event, template) {
        var descriptionStatus = template.descriptionVisibleVar.get();
        template.descriptionVisibleVar.set(!descriptionStatus);
        template.reportOptionsVar.set(false);
    },

    'click #backBtn': function (event, template) {
        var descriptionStatus = template.descriptionVisibleVar.get();
        template.descriptionVisibleVar.set(!descriptionStatus);
        template.reportOptionsVar.set(true);
    },

    'submit #reportPostoForm': function (event, template) {
        event.preventDefault();
        const target = event.target;

        const reported_item = this.postToReport;
        const reported_item_type = this.postTypeToReport;
        const report_category = target.report_category.value;
        const description = target.report_description.value;
        const user_id = Meteor.userId();
        const created_at = new Date();

        check(description, String);
        check(report_category, String);

        var newReport = {
            reportedItemId: reported_item,
            reportedItemType: reported_item_type,
            reportCategory: report_category,
            description: description,
            userID: user_id,
            createdAt: created_at
        };

        Meteor.call('reportExistForUser', reported_item, reported_item_type, function (error, result) {

            if (!result) {
                // Insert the report into the collection

                Meteor.call('addNewReport', newReport, function (error, result) {
                    if (error) {
                        Bert.alert({
                            hideDelay: 9000,
                            title: 'Something went wrong',
                            message: 'Something went wrong with the action, please try again later',
                            type: 'ambula-info',
                            style: 'fixed-top',
                            icon: 'fa fa-exclamation-triangle fa-2x'
                        });
                        console.log(error);
                    } else {
                        template.reportOptionsVar.set(false);
                        template.descriptionVisibleVar.set(false);

                        Modal.hide('recipeReportDialogBox');

                        Bert.alert({
                            hideDelay: 5000,
                            title: 'Report Successfully Submitted',
                            message: 'your report was successfully notified to theambula.lk',
                            type: 'success',
                            style: 'growl-top-right',
                            icon: 'fa-flag'
                        });
                    }
                });
            } else {
                Bert.alert({
                    hideDelay: 7000,
                    message: 'You Have Already Reported This Post!',
                    type: 'ambula-info',
                    style: 'fixed-top',
                    icon: 'fa-clock-o fa-2x'
                });

                Modal.hide('recipeReportDialogBox');
            }
        });
    }
});

Template.postReportDialogBox.helpers({

    somethingElseSelected: function () {
        return Template.instance().reportOptionsVar.get()
    },

    descriptionVisible: function () {
        return Template.instance().descriptionVisibleVar.get();
    },

    errors: function () {
        var context = Reports.simpleSchema().namedContext("reportForm");

        return context.invalidKeys().map(function (data) {
            return {field: data.name, message: context.keyErrorMessage(data.name)}
        });

    },
});