Comments.ui.config({
    template: 'bootstrap', // or ionic, semantic-ui
    allowAnonymous: () => true,
    anonymousSalt: 'changeme',
    // generateAvatar: function (user, isAnonymous) {
    //     return  "http://res.cloudinary.com/sajidhz/image/upload/c_fill,h_150,w_150/" +user.profile.user_avatar;
    // },
    generateUsername: function (user) {
        return user.profile.first_name+" "+ user.profile.last_name;
    }

});