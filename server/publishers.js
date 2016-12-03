import {Meteor} from 'meteor/meteor';

import {YoutubeVideos} from '../imports/api/youtubevideos.js';
//
Meteor.publish("search-videos", function (query) {
    check(query, String);

    return YoutubeVideos.find({videoTitle: {$regex: query, $options: '-i'}});
});


Meteor.publish("user-channel"  , function(userId){
  check(userId, String);
  return Meteor.users.find({ _id : userId});
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
})


