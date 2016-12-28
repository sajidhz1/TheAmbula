import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './channel-recipe-tile.html';

Template.channelRecipeTile.helpers({
    createdDate: function () {
        return moment(this.createdAt).format('MMMM Do YYYY');
    },
});

Template.channelRecipeTile.events({
    'click .single-view-tile-report': function (event) {

        if (Meteor.user()) {
            event.preventDefault();

            Modal.show('recipeReportDialogBox', {
                videoIdToReport: this._id
            });
        } else {
            Bert.alert({
                hideDelay: 5000,
                title: 'Log in to theambula.lk',
                message: 'You must be logged in to theambula.lk to report a post',
                type: 'ambula-info',
                style: 'fixed-top',
                icon: 'fa-info-circle fa-2x'
            });
        }
    }
});