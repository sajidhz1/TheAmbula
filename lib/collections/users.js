import { YoutubeVideos } from '../../imports/api/youtubevideos.js';


if (Meteor.isServer) {
  Meteor.methods({
    usersHasVideos: function () {
      return Meteor.wrapAsync(callback => {
        YoutubeVideos.rawCollection().distinct('owner', callback);

      })();
    },
    getUserObjects: function (userIds) {
      return Meteor.users.find({ _id: { $in: userIds } }).fetch();
    },
    getUserChannelProfile: function (userId) {
      return Meteor.users.find({ _id: userId }).fetch();
    },
    getUserRecipeCount: function () {
       return YoutubeVideos.aggregate([
        { $group: { _id: { owner: "$owner" }, Total: { $sum: 1 } } },
        { $project: { _id: 0, owner: "$_id", Total: 1 } },
        { $sort: { owner : 1 } }
      ]);
    },
    updateUserRole : function(){
        if(Meteor.user().emails[0].address=="sajidhzazahir@gmail.com"){
                    Roles.addUsersToRoles( Meteor.userId() , [ 'admin' ] );
         }
    }
  });
}