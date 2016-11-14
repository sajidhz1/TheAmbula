/**
 * Created by Dulitha RD on 11/14/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {YoutubeVideos} from '../api/youtubevideos.js';

import './itemerrors.html';

Template.itemerrors.helpers({
    errors: function(){
        var context = YoutubeVideos.simpleSchema().namedContext(this.contextName);
        return context.invalidKeys().map(function(data){ return {message: context.keyErrorMessage(data.name)}});
    }
});