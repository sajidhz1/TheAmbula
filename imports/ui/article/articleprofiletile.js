/**
 * Created by Dulitha RD on 4/30/2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './articleprofiletile.html';

import {cloudinaryUrl} from './../../../lib/constants.js';

Template.profileArticleTile.onCreated(function bodyOnCreated() {

    //To store the existing image ids in db
    this.dbImageList = new ReactiveArray();
    //To store the existing images in cloudinary by comparing to imageList from db
    this.serverImageList = new ReactiveArray();

    this.tileImage = new ReactiveVar();

});

Template.profileArticleTile.onRendered(function () {
    var dataContext = Template.currentData();

    const instance = Template.instance();

    this.dbImageList = dataContext.articleImages;

    instance.dbImageList.forEach(function (entry) {
        Meteor.call('checkIfImageExists', entry, function (error, result) {
            if (error) {
                console.log('Error');
            } else {
                if (result) {
                    instance.serverImageList.push(entry);
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
        const instance = Template.instance();
        instance.tileImage.set(instance.serverImageList.array()[0]);
        return instance.tileImage.get();
    },

    shareData: function () {
        var data = Template.currentData();
        const instance = Template.instance();

        var body = data.articleBody;
        var bodyArray = [];

        body.split('</p>').map(function (data) {
            bodyArray.push(data);
        });

        var tmp = document.createElement("DIV");
        tmp.innerHTML = bodyArray[0].replace(/^(.{500}[^\s]*).*/, "$1");

        return {
            title: data.articleTitle,
            author: data.ownerID,
            url: 'http://www.theambula.lk/article/' + data._id,
            image: cloudinaryUrl + instance.tileImage.get(),
            description: tmp.textContent || tmp.innerText || tmp.innerHTML || ""
        }

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