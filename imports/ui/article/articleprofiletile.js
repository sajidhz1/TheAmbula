/**
 * Created by Dulitha RD on 4/30/2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {Articles} from './../../api/article.js';

import './articleprofiletile.html';

//To store the existing image ids in db
var dbImageList = new ReactiveArray();

//To store the existing images in cloudinary by comparing to imageList from db
Template.profileArticleTile.serverImageList = new ReactiveVar([]);

Template.profileArticleTile.tileImage = new ReactiveVar(false);

Template.profileArticleTile.onCreated(function bodyOnCreated() {

    var dataContext = Template.currentData();
    dbImageList = new ReactiveArray(dataContext.articleImages);
    console.log(dataContext.articleTitle + " " +dataContext.articleImages);
});

Template.profileArticleTile.onRendered(function () {
    dbImageList.forEach(function (entry) {
        Meteor.call('checkIfImageExists', entry, function (error, result) {
            if (error) {
                console.log('Error');
            } else {
                if (result) {
                    // dbImageList.remove(entry);
                }
            }
        });
    });
});

Template.profileArticleTile.helpers({
    isOwner: function () {
        return this.owner === Meteor.userId();
    },

    createdDate: function () {
        return moment(this.createdAt).format('MMMM Do YYYY');
    },

    tileCover: function () {
        return dbImageList.array()[0];
    }
});

Template.profileArticleTile.events({

    'click .profile-view-tile-delete': function (event) {

        event.preventDefault();

        Modal.show('postDeleteConfirmBox', {
            postToDelete: this._id,
            postOwner: this.owner,
            postType: 'article'
        });

    },

    'click .profile-view-tile-edit': function (event) {

        event.preventDefault();

        // Router.go('youtubeVideoUpdateForm', {videoId: this._id});

    },

    'click .profile-view-tile-report': function (event) {

        if (Meteor.user()) {
            event.preventDefault();

            Modal.show('postReportDialogBox', {
                postToReport: this._id,
                postTypeToReport: 'article'
            });
        } else {
            Bert.alert({
                hideDelay: 5000,
                title: 'Log In To theambula.lk',
                message: 'You must be logged in to theambula.lk to report a post',
                type: 'info',
                style: 'fixed-top',
                icon: 'fa-info-circle fa-2x'
            });
        }
    },
});