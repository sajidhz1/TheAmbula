/**
 * Created by Dulitha RD on 12/4/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './postdeleteconfirmbox.html'

Template.postDeleteConfirmBox.helpers({
    deleteMessage: function () {
        var deleteMessage = 'Are you sure you want to permanently delete this post';
        switch (this.postType) {
            case 'article':
                deleteMessage = 'Are you sure you want to permanently delete this article from';
                break;
            case 'ytVideo':
                deleteMessage = 'Are you sure you want to permanently delete this recipe video from';
                break;
        }

        return deleteMessage;
    }
});

Template.postDeleteConfirmBox.events({
    'click .__cancel': function (e, t) {
        Modal.hide();
    },

    'click .__delete': function (e, t) {
        var self = this;
        if (self.postOwner === Meteor.userId()) {
            switch (self.postType){
                case 'article':
                    Meteor.call('articles.delete', self.postToDelete, function (err) {
                        Modal.hide();
                        if (!err) {
                            Router.go('/profile');
                        } else {
                            console.log(err);
                        }
                    });
                    break;

                case 'ytVideo':
                    Meteor.call('youtubevideos.delete', self.postToDelete, function (err) {
                        Modal.hide();
                        if (!err) {
                            Router.go('/profile');
                        } else {
                            console.log(err);
                        }
                    });
                    break;
            }

        }
    },
});