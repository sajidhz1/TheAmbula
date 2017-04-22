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

        Modal.show('postDeleteConfirmBox', {
            postToDelete: this._id,
            postOwner: this.owner,
            postType:'ytVideo'
        });
    },

    'click .post-tile-view-edit': function (event) {

        event.preventDefault();

        Router.go('youtubeVideoUpdateForm', {videoId: this._id});

    },

    'click .post-tile-view-report': function (event) {

        if(Meteor.user()){
            event.preventDefault();

            Modal.show('postReportDialogBox', {
                postToReport: this._id,
                postTypeToReport: 'ytVideo'
            });
        }else{
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
    },
     shareData: function() {
         var data  =  Template.currentData();

          var tmp = document.createElement("DIV");
          tmp.innerHTML = data.videoDescription;
    
        return {
            title: data.videoTitle,
            author: data.ownerID,
            url : 'http://www.theambula.lk/recipe/'+data._id,
            image : 'https://img.youtube.com/vi/'+data.videoId+'/hqdefault.jpg',
            description : tmp.textContent || tmp.innerText || ""

        }

    }
});

