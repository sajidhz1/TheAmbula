import { YoutubeVideos } from '../../imports/api/youtubevideos.js';


if (Meteor.isServer) {
  Meteor.methods({
    usersHasVideos: function () {
      return Meteor.wrapAsync(callback => {
        YoutubeVideos.rawCollection().distinct('username', callback);

      })();
    },
    getUserObjects: function (userNames) {
      return Meteor.users.find({ username: { $in: userNames } }).fetch();
    },
    getUserChannelProfile : function(userId){
      return Meteor.users.find({ _id : userId }).fetch();
    }
  });
}