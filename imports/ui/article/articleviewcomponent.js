/**
 * Created by Dulitha RD on 4/16/2017.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import {Articles} from './../../api/article.js';
import {YoutubeVideos} from './../../api/youtubevideos.js';


import './articleviewcomponent.html';

Template.articleViewComp.onCreated(function bodyOnCreated() {
    //To access reactive data context of the template instance. The Computation is automatically stopped when the template is destroyed.
    var dataContext = Template.currentData();

    //Subscription for video owner user profile
    Meteor.subscribe('get-user-by-id');

    //Subscription for featured videos
    Meteor.subscribe('featured-videos-collection');
});

Template.articleViewComp.helpers({
    createdDate: function () {
        return moment(this.article.createdAt).format('MMMM Do YYYY, h:mm:ss a');
    },

    ownerProfile: function () {
        try {
            var user = Meteor.users.find({_id: this.article.owner}, {fields: {profile: 1}}).fetch();
            var profile = user[0].profile;
            if(profile['first_name']){
                return profile['first_name'] + ' ' + profile['last_name'];
            }else{
                return profile['name'];
            }

        } catch (e) {
            //console.log(e);
        }
    },

    profileAvatar: function () {
        try {
            var user = Meteor.users.find({_id: this.article.owner}, {fields: {profile: 1}}).fetch();
            var profile = user[0].profile;
            return profile['user_avatar'];
        } catch (e) {
            //console.log(e);
        }
    },

    isOwner: function () {
        return this.article.owner === Meteor.userId();
    },

    featuredVideos: function () {
        if (Session.get('veganOnly')) {
            var count = YoutubeVideos.find({'vegan': true}).count();
            var start = Math.floor(Math.random() * (count - 7)) + 0;
            return YoutubeVideos.find({'vegan': true}, {skip: start, limit: 7, sort: {createdAt: -1}});
        } else {
            var count = YoutubeVideos.find().count();
            var start = Math.floor(Math.random() * (count - 7)) + 0;
            return YoutubeVideos.find({}, {skip: start, limit: 7, sort: {createdAt: -1}});
        }
    }
});