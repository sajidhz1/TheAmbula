import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './nav.html';

//inject type ahead when navbar is loaded
Template.nav.rendered = function () {
    Meteor.typeahead.inject();
};

Template.nav.onCreated(function bodyOnCreated() {
    Session.set('veganOnly', false);
});

Template.nav.helpers({
    search: function (query, sync, callback) {
        Meteor.call('search', query, {}, function (err, res) {
            if (err) {
                console.log(err);
                return;
            }

            callback(res.map(function (v) {
                return {value: v.videoTitle};
            }));
        });
    },

    notifications: function () {
        return Notifications.find({postUserId: Meteor.userId()}).fetch();
    },

    notificationsCount: function () {
        return Notifications.find({postUserId: Meteor.userId(), viewed: 0}).count();
    },

    veganOnlySelected: function () {
        return Session.get('veganOnly');
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
    'click #notifications-dropdown': function (e) {
        e.preventDefault();
        Meteor.call('updateViewed', function (err, res) {

        });
    },

    'click #veganOption': function (e) {
        e.preventDefault();
        if (Session.get('veganOnly')) {
            Session.set('veganOnly', false);
        } else {
            Session.set('veganOnly', true);
        }
    }
});