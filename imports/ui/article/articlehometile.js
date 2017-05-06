/**
 * Created by Dulitha RD on 5/6/2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {ReactiveDict} from 'meteor/reactive-dict';

import './articlehometile.html';


Template.articleHomeTile.onCreated(function bodyOnCreated() {

    this.dbImageList = new ReactiveArray();

    this.serverImageList = new ReactiveArray();

    this.tileImage = new ReactiveVar();

    Meteor.subscribe('get-user-by-id');

});

Template.articleHomeTile.onRendered(function () {
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

Template.articleHomeTile.events({
    'click .post-tile-view-delete': function (event) {

        event.preventDefault();

        Modal.show('postDeleteConfirmBox', {
            postToDelete: this._id,
            postOwner: this.owner,
            postType: 'article'
        });
    },

    'click .post-tile-view-edit': function (event) {

        event.preventDefault();

        // Router.go('youtubeVideoUpdateForm', {videoId: this._id});

    },

    'click .post-tile-view-report': function (event) {

        if (Meteor.user()) {
            event.preventDefault();

            Modal.show('postReportDialogBox', {
                postToReport: this._id,
                postTypeToReport: 'article'
            });
        } else {
            Bert.alert({
                hideDelay: 6000,
                title: 'Log in to theambula.lk',
                message: 'You must be logged in to theambula.lk to report a post',
                type: 'ambula-info',
                style: 'fixed-top',
                icon: 'fa-info-circle fa-2x'
            });
        }
    }
});

Template.articleHomeTile.helpers({
    createdDate: function () {
        return moment(this.createdAt).format('MMMM Do YYYY, h:mm:ss a');
    },
    
    articleHomeTileImage: function () {
        const instance = Template.instance();
        instance.tileImage.set(instance.serverImageList.array()[0]);
        return instance.tileImage.get();
    },

    ownerProfile: function () {
        try {
            var user = Meteor.users.find({_id: this.owner}, {fields: {profile: 1}}).fetch();
            var profile = user[0].profile;
            return profile['first_name'] ? profile['first_name'] + ' ' + profile['last_name'] : profile['name'];
        } catch (e) {
            //console.log(e);
        }
    },

    ownerID: function () {
        try {
            var user = Meteor.users.find({_id: this.owner}, {fields: {profile: 1}}).fetch();
            return user[0]._id;
        } catch (e) {
            //console.log(e);
        }
    },

    profileAvatar: function () {
        try {
            var user = Meteor.users.find({_id: this.owner}, {fields: {profile: 1}}).fetch();
            var profile = user[0].profile;
            return profile['user_avatar'];
        } catch (e) {
            //console.log(e);
        }
    },

    isOwner: function () {
        return this.owner === Meteor.userId();
    },

    shareData: function () {
        var data = Template.currentData();

        var tmp = document.createElement("DIV");
        tmp.innerHTML = data.videoDescription;

        return {
            title: data.articleTitle,
            author: data.ownerID,
            url: 'http://www.theambula.lk/article/' + data._id,
            image: '',
            description: tmp.textContent || tmp.innerText || ""

        }

    }
});