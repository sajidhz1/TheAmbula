/**
 * Created by Dulitha RD on 12/9/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {ReactiveDict} from 'meteor/reactive-dict';

import './heartbutton.html';

Template.heartButton.heartStatus = new ReactiveVar();

Template.heartButton.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
});

Template.heartButton.onRendered(function () {
    var dataContext = Template.currentData();

    const instance = Template.instance();

    Meteor.call('videoLiked', dataContext.videoHeartId, function (error, result) {
        if (!result) {
            instance.state.set('heartStatus', false);
        } else {
            instance.state.set('heartStatus', true);
        }
    });
});

Template.heartButton.helpers({
    isLiked: function () {
        if (Meteor.userId()) {
            const instance = Template.instance();
            return instance.state.get('heartStatus');
        }
    },

});

Template.heartButton.events({
    'click #heart': function (event, instance) {
        var videoHeartId = this.videoHeartId;

        Meteor.call('videoLiked', videoHeartId, function (error, result) {
            if (!result) {
                Meteor.call('likeVideo', videoHeartId, function (error, result) {
                    if (error) {
                        console.log(error)
                    } else {
                        instance.state.set('heartStatus', true);
                        Meteor.call('youtubevideo.user', videoHeartId, function (error, result) {
                            if (error) {
                                console.log(error)
                            } else {
                                Meteor.call('newNotification', videoHeartId, result, 'likes your post', function (error, result) {
                                    if (error) {
                                        console.log(error)
                                    } else {
                                        console.log('notification added');
                                    }
                                });
                            }
                        });

                    }
                });
            } else {
                Meteor.call('unlikeVideo', videoHeartId, function (error, result) {
                    if (error) {
                        console.log(error)
                    } else {
                        instance.state.set('heartStatus', false);
                    }
                });
            }
        });
    }
});