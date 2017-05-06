/**
 * Created by Dulitha RD on 4/16/2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Articles} from './../../api/article.js';
import {YoutubeVideos} from './../../api/youtubevideos.js';


import './articleviewcomponent.html';

//To store the existing image ids in db
var dbImageList = new ReactiveArray();
//To store the existing images in cloudinary by comparing to imageList from db
var serverImageList = new ReactiveArray();

Template.articleViewComp.onRendered(function () {

});
Template.articleViewComp.onCreated(function bodyOnCreated() {

    var dataContext = Template.currentData();
    dbImageList = dataContext.article.articleImages;

    dbImageList.forEach(function (entry) {
        Meteor.call('checkIfImageExists', entry, function (error, result) {
            if (error) {
                console.log('Error');
            } else {
                if (result) {
                    serverImageList.push(entry);
                }
            }
        });
    });

    //Subscription for video owner user profile
    Meteor.subscribe('get-user-by-id');

    //Subscription for featured videos
    Meteor.subscribe('featured-videos-collection');
});

Template.articleViewComp.helpers({
    conditionTrue: function (index, expression, value) {
        if (expression.indexOf('<=') >= 0) {
            return (index <= value)
        } else if (expression.indexOf('>') >= 0) {
            return (index > value)
        }
    },
    createdDate: function () {
        return moment(this.article.createdAt).format('MMMM Do YYYY, h:mm:ss a');
    },

    ownerProfile: function () {
        try {
            var user = Meteor.users.find({_id: this.article.owner}, {fields: {profile: 1}}).fetch();
            var profile = user[0].profile;
            if (profile['first_name']) {
                return profile['first_name'] + ' ' + profile['last_name'];
            } else {
                return profile['name'];
            }

        } catch (e) {
            //console.log(e);
        }
    },

    profileAvatar: function () {
        try {
            var user = Meteor.users.find({_id: this.article.owner}, {fields: {profile: 1}}).fetch();
            var profile = user[0].profile;
            return profile['user_avatar'];
        } catch (e) {
            //console.log(e);
        }
    },

    isOwner: function () {
        return this.article.owner === Meteor.userId();
    },

    featuredVideos: function () {
        if (Session.get('veganOnly')) {
            var count = YoutubeVideos.find({'vegan': true}).count();
            var start = Math.floor(Math.random() * (count - 7)) + 0;
            return YoutubeVideos.find({'vegan': true}, {skip: start, limit: 7, sort: {createdAt: -1}});
        } else {
            var count = YoutubeVideos.find().count();
            var start = Math.floor(Math.random() * (count - 7)) + 0;
            return YoutubeVideos.find({}, {skip: start, limit: 7, sort: {createdAt: -1}});
        }
    },

    articleParagraphs: function () {
        var body = this.article.articleBody;
        var bodyArray = [];
        var n = 0;

        body.split('</p>').map(function (data) {
            if (data.indexOf('<p>') < 0) {
                bodyArray.push({index: n, bodyPara: '<p>' + data + '</p>'});
            } else {
                bodyArray.push({index: n, bodyPara: data + '</p>'});
            }
            n++
        });
        return bodyArray;
    },

    exisitingImageList: function () {
        var galleryImageList = serverImageList.array();
        galleryImageList.shift();
        return galleryImageList;
    },

    coverImage: function () {
        return serverImageList.array()[0];
    }
});

Template.articleViewComp.events({
    'click .single-view-delete': function (event) {

        event.preventDefault();

        Modal.show('postDeleteConfirmBox', {
            postToDelete: this.article._id,
            postOwner: this.article.owner,
            postType: 'article'
        });

    },

    'click .single-view-edit': function (event) {

        event.preventDefault();

        // Router.go('youtubeVideoUpdateForm', {videoId: this.article._id});

    },

    'click .single-view-report': function (event) {

        if (Meteor.user()) {
            event.preventDefault();

            Modal.show('postReportDialogBox', {
                postToReport: this.article._id,
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

    'click .js-activate-s-image-box': function (e) {
        var imgPath = $(e.currentTarget).data('full-image-src');
        if (imgPath) {
            sImageBox.open(imgPath, {
                animation: 'zoomIn'
            });
        }
    }
});