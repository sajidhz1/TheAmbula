/**
 * Created by Dulitha RD on 12/9/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Hearts = new Mongo.Collection('hearts');

var Schemas = {};

Schemas.hearts = new SimpleSchema({
    likedVideoId: {
        type: String,
        label: "Video Id"
    },
    userID: {
        type: String,
        label: "User Id"
    },
    createdAt: {
        type: Date,
        label: 'Date of heart added'
    }
});

Hearts.attachSchema(Schemas.hearts);

Meteor.methods({

    'likeVideo': function (videoId) {
        check(videoId, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
            return false;
        }

        var heart = {
            likedVideoId: videoId,
            userID: this.userId,
            createdAt: new Date()
        };

        return Hearts.insert(heart);
    },

    'unlikeVideo': function (videoId) {
        check(videoId, String);

        if (Meteor.isServer) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            var heart = Hearts.findOne({likedVideoId:videoId,userID: this.userId});

            if (heart.userID !== this.userId) {
                throw new Meteor.Error('not-authorized');
            } else {
                Hearts.remove(heart);
            }
        }

    },

    'videoLiked': function (videoId) {
        check(videoId, String);

        var heart = Hearts.findOne({likedVideoId:videoId,userID: this.userId});

        if (heart) {
            return true;
        } else {
            return false;
        }
    }
});
