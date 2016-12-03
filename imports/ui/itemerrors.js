/**
 * Created by Dulitha RD on 11/14/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {YoutubeVideos} from '../api/youtubevideos.js';

import './itemerrors.html';

Template.itemerrors.helpers({
    errors: function () {
        var context = YoutubeVideos.simpleSchema().namedContext("insertForm");
        
        return context.invalidKeys().filter(function (item) {
            if (item.name != 'videoId') {
                return item;
            }
        }).map(function (data) {
            return {message: context.keyErrorMessage(data.name)}
        });
    }
});