import {Meteor} from 'meteor/meteor';

import {YoutubeVideos} from '../imports/api/youtubevideos.js';
import {Hearts} from '../imports/api/hearts.js';
//
Meteor.publish("search-videos", function (query) {
    check(query, String);

    return YoutubeVideos.find({videoTitle: {$regex: query, $options: '-i'}});
});


Meteor.publish("user-channel", function (userId) {
    check(userId, String);
    return Meteor.users.find({_id: userId});
});

Meteor.publish("search-videos-by-owner", function (owner) {
    check(owner, String);

    return YoutubeVideos.find({owner: owner});
});

Meteor.publish("get-user-by-id", function () {
    return Meteor.users.find({}, {fields: {profile: 1}});
});

Meteor.publish("get-ytvideo-by-id", function (videoId) {
    check(videoId, String);

    return YoutubeVideos.find({_id: videoId});
});

// server: publish the current size of a collection
Meteor.publish("heart-count-by-postId", function (postId) {
    var self = this;
    check(postId, String);
    var count = 0;
    var initializing = true;

    // observeChanges only returns after the initial `added` callbacks
    // have run. Until then, we don't want to send a lot of
    // `self.changed()` messages - hence tracking the
    // `initializing` state.
    var handle = Hearts.find({likedVideoId: postId}).observeChanges({
        added: function (id) {
            count++;
            if (!initializing)
                self.changed("counts", postId, {heartCount: count});
        },
        removed: function (id) {
            count--;
            self.changed("counts", postId, {heartCount: count});
        }
        // don't care about changed
    });

    // Instead, we'll send one `self.added()` message right after
    // observeChanges has returned, and mark the subscription as
    // ready.
    initializing = false;
    self.added("counts", postId, {heartCount: count});
    self.ready();

    // Stop observing the cursor when client unsubs.
    // Stopping a subscription automatically takes
    // care of sending the client any removed messages.
    self.onStop(function () {
        handle.stop();
    });
});

Meteor.publish('notifications', function () {
    return Notifications.find({postUserId: this.userId});
});

