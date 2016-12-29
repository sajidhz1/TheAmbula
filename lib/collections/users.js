import { YoutubeVideos } from '../../imports/api/youtubevideos.js';


if (Meteor.isServer) {
  Meteor.methods({
    usersHasVideos: function () {
      return Meteor.wrapAsync(callback => {
        YoutubeVideos.rawCollection().distinct('owner', callback);

      })();
    },
    getUserObjects: function (userIds) {
      return Meteor.users.find({ _id : { $in: userIds } }).fetch();
    },
    getUserChannelProfile : function(userId){
      return Meteor.users.find({ _id : userId }).fetch();
    }
  });
}