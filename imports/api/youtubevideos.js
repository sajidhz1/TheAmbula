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

        YoutubeVideos.insert(
            newYoutubeVideo, {validationContext: 'insertForm'}, function (error, response) {
                if (error) {
                    return error;
                }else{
                    return response;
                }
            }
        );
    },
});