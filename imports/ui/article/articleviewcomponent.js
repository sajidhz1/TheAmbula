/**
 * Created by Dulitha RD on 4/16/2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {YoutubeVideos} from './../../api/youtubevideos.js';

import './articleviewcomponent.html';

import {cloudinaryUrl} from './../../../lib/constants.js';

Template.articleViewComp.onCreated(function bodyOnCreated() {

    //To store the existing image ids in db
    this.dbImageList = new ReactiveArray();
    //To store the existing images in cloudinary by comparing to imageList from db
    this.serverImageList = new ReactiveArray();

    this.coverImg = new ReactiveVar();

    //Subscription for video owner user profile
    Meteor.subscribe('get-user-by-id');

    //Subscription for featured videos
    Meteor.subscribe('featured-videos-collection');
});

Template.articleViewComp.onRendered(function () {

    var dataContext = Template.currentData();

    const instance = Template.instance();

    this.dbImageList = dataContext.article.articleImages;

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
        const instance = Template.instance();
        var galleryImageList = instance.serverImageList.array();
        galleryImageList.shift();
        return galleryImageList;
    },

    coverImage: function () {
        const instance = Template.instance();
        instance.coverImg.set(instance.serverImageList.array()[0]);
        return instance.coverImg.get();
    },

    shareData: function () {
        var data = Template.currentData();
        const instance = Template.instance();

        var body = data.article.articleBody;
        var bodyArray = [];

        body.split('</p>').map(function (data) {
            bodyArray.push(data);
        });

        var tmp = document.createElement("DIV");
        tmp.innerHTML = bodyArray[0].replace(/^(.{500}[^\s]*).*/, "$1");

        return {
            title: data.article.articleTitle,
            author: data.article.ownerID,
            url: 'http://www.theambula.lk/article/' + data.article._id,
            image: cloudinaryUrl + instance.coverImg.get(),
            description: tmp.textContent || tmp.innerText || tmp.innerHTML || ""
        }

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