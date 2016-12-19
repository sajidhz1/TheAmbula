import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';

import './post_tile.html';

Template.postTile.onCreated(function bodyOnCreated() {

    Meteor.subscribe('get-user-by-id');

});

Template.postTile.events({
    'click .post-tile-view-dlete': function (event) {

        event.preventDefault();

        Modal.show('recipeDeleteConfirmBox', {
            videoIdToDelete: this._id,
            videoOwner: this.owner
        });
    },

    'click .post-tile-view-edit': function (event) {

        event.preventDefault();

        Router.go('youtubeVideoUpdateForm',{videoId: this._id});

    },
});


//TODO : handle profile code using the profile object
Template.postTile.helpers({
    createdDate: function () {
        return moment(this.createdAt).format('MMMM Do YYYY, h:mm:ss a');
    },

    ownerProfile: function () {
        try {
            var user = Meteor.users.find({_id: this.owner}, {fields: {profile: 1}}).fetch();
            var profile = user[0].profile;
            return profile['first_name']?profile['first_name'] + ' ' + profile['last_name']:profile['name'];
        } catch (e) {
            //console.log(e);
        }
    },
    ownerID : function (){
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
    }
});