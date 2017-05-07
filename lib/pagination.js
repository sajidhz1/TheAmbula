import {Meteor} from 'meteor/meteor';

import {YoutubeVideos} from '../imports/api/youtubevideos.js';
import {Articles} from '../imports/api/article.js';

if (Meteor.isServer) {

    Meteor.publish('items-collection', function (limit) {

        return YoutubeVideos.find({}, {limit: limit, sort: {createdAt: -1}});
    });

    Meteor.publish('Article-collection', function (limit) {

        return Articles.find({}, {limit: limit, sort: {createdAt: -1}});
    });

} else if (Meteor.isClient) {

    var ITEMS_INCREMENT = 4;
    Session.setDefault('itemsLimit', ITEMS_INCREMENT);
    Deps.autorun(function () {

        Meteor.subscribe('items-collection', Session.get('itemsLimit'));
        Meteor.subscribe('Article-collection', Session.get('itemsLimit'));

    });

    Template.collectionPagination.helpers({
        posts: function () {
            let videos = [];
            let articles = [];
            let results = [];
            if (Session.get('veganOnly')) {
                videos = YoutubeVideos.find({'vegan': true}).fetch();
                return YoutubeVideos.find({'vegan': true}).fetch();
            } else {
                videos = YoutubeVideos.find().fetch();
                articles = Articles.find().fetch();
            }

            if (videos.length) {
                videos.map(function (item) {
                    item.postTypeHome = 'ytVideo';
                    return item;
                });
            }

            if (articles.length) {
                articles.map(function (item) {
                    item.postTypeHome = 'article'
                    return item;
                });
            }

            results = videos.concat(articles);
            results = _.sortBy(results, 'createdAt').reverse();
            console.log(results);
            return results;
        },

        moreResults: function () {
            // If, once the subscription is ready, we have less rows than we
            // asked for, we've got all the rows in the collection.
            if (Session.get('veganOnly')) {
                return !(YoutubeVideos.find({'vegan': true}).count() < Session.get("itemsLimit"));
            } else {
                return !(YoutubeVideos.find().count() < Session.get("itemsLimit"));
            }
        },

        postType: function (postType) {
            if (postType === 'ytVideo') {
                return true;
            }else {
                return false;
            }
        }
    });

    function showMoreVisible() {
        var cloudContainer = $(".cloud-container");
        var threshold, target = $("#showMoreResults");
        if (!target.length) return;

        threshold = $(window).scrollTop() + $(window).height() - target.height() + cloudContainer.height();

        if (target.offset().top < threshold) {
            if (!target.data("visible")) {
                //  console.log("target became visible (inside viewable area)");
                target.data("visible", true);
                Session.set("itemsLimit",
                    Session.get("itemsLimit") + ITEMS_INCREMENT);
            }
        } else {
            if (target.data("visible")) {
                // console.log("target became invisible (below viewable arae)");
                target.data("visible", false);
            }
        }
    }

    $(window).scroll(showMoreVisible);

}