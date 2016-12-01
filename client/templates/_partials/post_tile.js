import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './post_tile.html';

Template.postTile.onCreated(function bodyOnCreated() {

    var instance = this;

    Meteor.subscribe('get-user-by-id');
});


Template.postTile.events({
    'click #heart': function () {
        alert(this.owner);
    },
});

Template.postTile.events({
    'keyup .panel-google-plus-comment > .panel-google-plus-textarea > textarea': function (e) {
        var $comment = $(this).closest('.panel-google-plus-comment');

        $comment.find('button[type="submit"]').addClass('disabled');
        if ($(this).val().length >= 1) {
            $comment.find('button[type="submit"]').removeClass('disabled');
        }
    }
});


//TODO : handle profile code using the profile object
Template.postTile.helpers({
    createdDate: function () {
        return moment(this.createdAt).format('MMMM Do YYYY, h:mm:ss a');
    },

    ownerProfile: function () {
        var user = Meteor.users.find({ _id: this.owner }, { fields: { profile: 1 } }).fetch();
        var profile = user[0].profile;
        return profile['first_name'] + ' ' + profile['last_name'];
    },
    profileAvatar: function () {
        var user = Meteor.users.find({ _id: this.owner }, { fields: { profile: 1 } }).fetch();
        var profile = user[0].profile;
        return profile['user_avatar'];
    }
});