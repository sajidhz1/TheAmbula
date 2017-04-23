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

    Meteor.call('postLiked', dataContext.postHeartId, dataContext.postType, function (error, result) {
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

        if (Meteor.user()) {
            //To Reduce the lag, heart status would be changed to the negate of the current status without any db querying
            //After querying it would be changed or not again accordingly
            var currentHeartStatus = instance.state.get('heartStatus');
            instance.state.set('heartStatus', !currentHeartStatus);

            var postHeartId = this.postHeartId;
            var postType = this.postType;
            Meteor.call('postLiked', postHeartId, postType, function (error, result) {
                    if (!result) {
                        Meteor.call('likePost', postHeartId, postType, function (error, result) {
                            if (error) {
                                console.log(error);
                                Bert.alert({
                                    hideDelay: 9000,
                                    title: 'Something went wrong',
                                    message: 'Something went wrong with the action, please try again later',
                                    type: 'ambula-info',
                                    style: 'fixed-top',
                                    icon: 'fa fa-exclamation-triangle fa-2x'
                                });
                            } else {
                                instance.state.set('heartStatus', true);
                                switch (postType) {
                                    case 'ytVideo':
                                        Meteor.call('youtubevideo.user', postHeartId, function (error, result) {
                                            if (error) {
                                                console.log(error)
                                            } else {
                                                Meteor.call('newNotification', postHeartId, result, 'likes your post', function (error, result) {
                                                    if (error) {
                                                        console.log(error)
                                                    } else {
                                                        console.log('notification added');
                                                    }
                                                });
                                            }
                                        });
                                        break;
                                    case 'article':
                                        Meteor.call('article.user', postHeartId, function (error, result) {
                                            if (error) {
                                                console.log(error)
                                            } else {
                                                Meteor.call('newNotification', postHeartId, result, 'likes your post', function (error, result) {
                                                    if (error) {
                                                        console.log(error)
                                                    } else {
                                                        console.log('notification added');
                                                    }
                                                });
                                            }
                                        });
                                        break;
                                }


                            }
                        });
                    } else {
                        Meteor.call('unlikePost', postHeartId, postType, function (error, result) {
                            if (error) {
                                console.log(error);
                                Bert.alert({
                                    hideDelay: 9000,
                                    title: 'Something went wrong',
                                    message: 'Something went wrong with the action, please try again later',
                                    type: 'ambula-info',
                                    style: 'fixed-top',
                                    icon: 'fa fa-exclamation-triangle fa-2x'
                                });
                            } else {
                                instance.state.set('heartStatus', false);
                            }
                        });
                    }
                }
            )
            ;
        } else {
            Bert.alert({
                hideDelay: 9000,
                title: 'Log in to theambula.lk',
                message: 'You must be logged in to theambula.lk to add favourites',
                type: 'ambula-info',
                style: 'fixed-top',
                icon: 'fa-info-circle fa-2x'
            });
        }

    }
});