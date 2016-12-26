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
        console.log(Notifications.find({  postUserId : Meteor.userId()}).fetch());
        return  Notifications.find({  postUserId : Meteor.userId()}).fetch();
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
    }
});