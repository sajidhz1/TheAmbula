/**
 * Created by Dulitha RD on 11/6/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const YoutubeVideos = new Mongo.Collection('youtubevideos');

Meteor.methods({
    'youtubevideos.insert'(video_id, video_title, video_url, video_description) {
        //alert('Api eka athule');

        check(video_title, String);
        check(video_url, String);
        check(video_description, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        YoutubeVideos.insert({
            videoId: video_id,
            videoTitle: video_title,
            videoUrl: video_url,
            videoDescription: video_description,
            createdAt: new Date(),
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username,
        });
    },
});