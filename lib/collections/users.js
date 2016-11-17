import { YoutubeVideos } from '../../imports/api/youtubevideos.js';


if (Meteor.isServer) {
  Meteor.methods({
    usersHasVideos: function () {
      return Meteor.wrapAsync(callback => {
         YoutubeVideos.rawCollection().distinct('username', callback);
              
    })();
     }//,
    // createNewUser: function(user){
        
    //   Accounts.createUser(user , function(err){
    //        if(err){
    //           return err;
    //        }else{
    //           return 'Successfully registered';
    //        }
    //     });
    // }
  });
}