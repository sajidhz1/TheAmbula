/**
 * Created by Dulitha RD on 12/9/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Hearts = new Mongo.Collection('hearts');

var Schemas = {};

Schemas.hearts = new SimpleSchema({
    likedPostId: {
        type: String,
        label: "Video Id"
    },
    userID: {
        type: String,
        label: "User Id"
    },
    postType: {
        type: String,
        label: "Post Type"
    },
    createdAt: {
        type: Date,
        label: 'Date of heart added'
    }
});

Hearts.attachSchema(Schemas.hearts);

Meteor.methods({

    'likePost': function (postId, postType) {
        check(postId, String);
        check(postType, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
            return false;
        }

        var heart = {
            likedPostId: postId,
            userID: this.userId,
            postType: postType,
            createdAt: new Date()
        };

        return Hearts.insert(heart);
    },

    'unlikePost': function (postId, postType) {
        check(postId, String);
        check(postType, String);

        if (Meteor.isServer) {
            if (!this.userId) {
                throw new Meteor.Error('not-authorized');
            }

            var heart = Hearts.findOne({likedPostId: postId, userID: this.userId, postType: postType});

            if (heart.userID !== this.userId) {
                throw new Meteor.Error('not-authorized');
            } else {
                Hearts.remove(heart);
            }
        }

    },

    'postLiked': function (postId, postType) {
        check(postId, String);
        check(postType, String);

        var heart = Hearts.findOne({likedPostId: postId, userID: this.userId, postType: postType});

        if (heart) {
            return true;
        } else {
            return false;
        }
    }
});
