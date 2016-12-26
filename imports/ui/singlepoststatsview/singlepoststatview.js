/**
 * Created by Dulitha RD on 12/24/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Counts} from '../../api/counts.js';

import './singlepoststatview.html';

Template.singlePostStatView.onCreated(function bodyOnCreated() {
    var dataContext = Template.currentData();

    var self = this;
    self.autorun(function () {
        self.subscribe("heart-count-by-postId", dataContext.postId);
    });
});


Template.singlePostStatView.helpers({
    heartCount: function () {
        /*Initially this Counts is null so using a try catch block to prevent exceptions from showing*/
        try {
            return Counts.findOne(this.postId).heartCount;
        } catch (exception) {
            return 0;
        }
    },

    viewCount: function () {
        
    }
});