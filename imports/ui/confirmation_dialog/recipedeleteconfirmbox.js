/**
 * Created by Dulitha RD on 12/4/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './recipedeleteconfirmbox.html'

Template.recipeDeleteConfirmBox.events({
    'click .__cancel': function (e, t) {
        Modal.hide();
    },

    'click .__delete': function (e, t) {
        var self = this;
        if (self.videoOwner === Meteor.userId()) {
            Meteor.call('youtubevideos.delete', self.videoIdToDelete, function (err) {
                Modal.hide();
                if (!err) {
                    Router.go('/profile');
                } else {
                    console.log(err);
                }
            });
        }
    },
});