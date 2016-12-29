/**
 * Created by Dulitha RD on 11/6/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './youtubevideoviewcomponent.html';

Template.youtubeVideoViewComp.onCreated(function bodyOnCreated() {

    //To access reactive data context of the template instance. The Computation is automatically stopped when the template is destroyed.
    var dataContext = Template.currentData();

    //Subscription for video owner user profile
    Meteor.subscribe('get-user-by-id');

    // Make sure it's in client
    if (Meteor.isClient) {

        // YouTube API will call onYouTubeIframeAPIReady() when API ready.
        // Make sure it's a global variable.
        onYouTubeIframeAPIReady = function () {

            // New Video Player, the first argument is the id of the div.
            // Make sure it's a global variable.
            player = new YT.Player("player", {

                height: "400",
                width: "600",

                // videoId is the "v" in URL (ex: http://www.youtube.com/watch?v=LdH1hSWGFGU, videoId = "LdH1hSWGFGU")
                videoId: dataContext.video.videoId,

                // Events like ready, state change,
                events: {

                    onReady: function (event) {

                        // Play video when player ready.
                        //event.target.playVideo();
                    },

                    onload: function (event) {

                        // Play video when player ready.
                        //event.target.playVideo();
                    }

                }

            });

        };

        YT.load();
    }


});

Template.youtubeVideoViewComp.helpers({
    createdDate: function () {
        return moment(this.video.createdAt).format('MMMM Do YYYY, h:mm:ss a');
    },

    ownerProfile: function () {
        try {
            var user = Meteor.users.find({_id: this.video.owner}, {fields: {profile: 1}}).fetch();
            var profile = user[0].profile;
            if(profile['first_name']){
                return profile['first_name'] + ' ' + profile['last_name'];
            }else{
                return profile['name'];
            }
            
        } catch (e) {
            //console.log(e);
        }
    },

    profileAvatar: function () {
        try {
            var user = Meteor.users.find({_id: this.video.owner}, {fields: {profile: 1}}).fetch();
            var profile = user[0].profile;
            return profile['user_avatar'];
        } catch (e) {
            //console.log(e);
        }
    },

    isOwner: function () {
        return this.video.owner === Meteor.userId();
    }
});

Template.youtubeVideoViewComp.events({
    'click .single-view-dlete': function (event) {

        event.preventDefault();

        Modal.show('recipeDeleteConfirmBox', {
            videoIdToDelete: this.video._id,
            videoOwner: this.video.owner
        });

    },

    'click .single-view-edit': function (event) {

        event.preventDefault();

        Router.go('youtubeVideoUpdateForm', {videoId: this.video._id});

    },

    'click .single-view-tile-report': function (event) {

        if (Meteor.user()) {
            event.preventDefault();

            Modal.show('recipeReportDialogBox', {
                videoIdToReport: this.video._id
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
    }
});

