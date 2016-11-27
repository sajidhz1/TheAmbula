import {YoutubeVideos} from '../imports/api/youtubevideos.js';
//
Meteor.publish("search-videos", function(query){
  check(query, String);

  return YoutubeVideos.find({videoTitle: {$regex: query, $options: '-i'}});
});


Meteor.publish("search-videos-by-owner", function(ownerId){
  return YoutubeVideos.find({owner : ownerId});
});

Meteor.publish("user-channel"  , function(userId){
  check(userId, String);
  return Meteor.users.find({ _id : userId});
});


