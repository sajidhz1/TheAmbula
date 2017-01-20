/**
 * Created by Dulitha RD on 11/6/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const YoutubeVideos = new Mongo.Collection('youtubevideos');

var Schemas = {};

Schemas.youtubevideo = new SimpleSchema({
    videoId: {
        type: String,
        label: "Video id",
        max: 11,
        min: 11
    },
    videoTitle: {
        type: String,
        label: "Video title",
        max: 250,
        min: 10
    },
    videoUrl: {
        type: String,
        label: "Youtube video url",
        regEx: SimpleSchema.RegEx.Url,
    },
    recipeCategory: {
        type: String,
        label: "Recipe category",
    },
    vegan: {
        type: Boolean,
        label: "Recipe vegan status",
        defaultValue: false
    },
    videoDescription: {
        type: String,
        label: "Video description",
        max: 1500,
        min: 100
    },
    createdAt: {
        type: Date,
        label: "Date video was saved",
    },
    owner: {
        type: String,
        label: "User who saved the video"
    },
    username: {
        type: String,
        label: "Username of who saved the video",
        optional: true

    },
    updatedAt: {
        type: Date,
        label: "Date video details were updated",
        optional: true
    }
});

YoutubeVideos.attachSchema(Schemas.youtubevideo);

Meteor.methods({
    'youtubevideos.insert': function (newYoutubeVideo) {

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        newYoutubeVideo.owner = this.userId;
        newYoutubeVideo.username = Meteor.users.findOne(this.userId).username;

        return YoutubeVideos.insert(newYoutubeVideo, {validationContext: 'insertForm'});

    },

    'youtubevideos.delete': function (ytVideoID) {

        check(ytVideoID, String);

        if (Meteor.isServer) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            const ytVideo = YoutubeVideos.findOne(ytVideoID);

            if (ytVideo.owner !== this.userId) {
                throw new Meteor.Error('not-authorized');
            } else {
                YoutubeVideos.remove(ytVideoID);
            }
        }
    },

    'youtubevideos.exist': function (ytVideoID) {

        check(ytVideoID, String);

        var ytVideo = YoutubeVideos.findOne({videoId: ytVideoID});
        if (ytVideo) {
            return true;
        } else {
            return false;
        }

    },

    'youtubevideos.update': function (ytVideoID, videoTitle, videoCategory, recipeVegan, videoDescription) {

        check(ytVideoID, String);
        check(videoTitle, String);
        check(videoCategory, String);
        check(videoDescription, String);
        //check(recipeVegan, Boolean);

        const ytVideo = YoutubeVideos.findOne(ytVideoID);

        // Make sure only the task owner can make a task private
        if (ytVideo.owner !== this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        return YoutubeVideos.update(ytVideoID, {
            $set: {
                videoTitle: videoTitle,
                recipeCategory: videoCategory,
                vegan: recipeVegan,
                videoDescription: videoDescription,
                updatedAt: new Date()
            }
        });

    },
    'youtubevideo.user': function (ytVideoID) { //  or try saving post ownerID in a Session
        check(ytVideoID, String);
        return YoutubeVideos.findOne(ytVideoID).owner;
    }
});