
 Notifications = new Meteor.Collection('notifications');

var Schemas = {};

Schemas.notifications = new SimpleSchema({
    postId: {
        type: String,
        label: "Video Id"
    },
    postUserId: {
        type: String,
        label: "Video Owner Id"
    },
    userID: {
        type: String,
        label: "User Id"
    },
    createdAt: {
        type: Date,
        label: 'Date of notification added'
    },
    message: {
        type: String,
        label: 'Notification Message'
    },
    viewed: {
        type: Number,
        label: 'Notification Viewed State',
        optional: true
    }
});

Notifications.attachSchema(Schemas.notifications);

// if(Meteor.isClient){
//     Deps.autorun(function () {
//         Meteor.subscribe('notifications');
//     });
// }

if (Meteor.isServer) {
    Meteor.methods({

        'newNotification': function (postId, ownerId, message) {
            check(postId, String);

            if (!this.userId) {
                //   throw new Meteor.Error('not-authorized');
                return false;
            }
            var user = Meteor.users.findOne({ "_id" : this.userId });
            var name = ""
            if(user.profile.first_name){
                name = user.profile.first_name;
            }else{
                name = user.profile.name;
            }

            var notification = {
                postId: postId,
                userID: this.userId,
                postUserId: ownerId,
                message: name + " "+ message,
                createdAt: new Date(),
                viewed : 0
            };
            console.log('new notifications');
            return Notifications.insert(notification);
        }
        ,
        'updateViewed': function () {
            return Notifications.update({ "postUserId" : this.userId },{$set: {viewed : 1}},{multi: true});
        }

    });
}
