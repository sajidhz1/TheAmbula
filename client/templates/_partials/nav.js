import './nav.html';

//inject type ahead when navbar is loaded
Template.nav.rendered = function () {
    Meteor.typeahead.inject();
};

Template.nav.helpers({
    search: function (query, sync, callback) {
        Meteor.call('search', query, {}, function (err, res) {
            if (err) {
                console.log(err);
                return;
            }

            callback(res.map(function (v) {
                return { value: v.videoTitle };
            }));
        });
    },
    notifications: function () {
        return  Notifications.find({  postUserId : Meteor.userId()}).fetch();
    },
    notificationsCount : function(){
        return  Notifications.find({  postUserId : Meteor.userId() , viewed : 0 }).count();
    }

});

Template.nav.events({
    'click #addNewYtVideo': function (e) {
        e.preventDefault();
        if (Meteor.user()) {
            Modal.show('youtubeVideoAddForm');
        } else {
            Router.go('/login');
        }

    },
    'click #logout': function (e) {
        Meteor.logout(function (err) {
            if (err) {

            } else {
                Router.go('/');
            }
        });
    },
    'click #notifications-dropdown' : function(e){
        e.preventDefault();
        Meteor.call('updateViewed',function(err, res){

        });
    }
});