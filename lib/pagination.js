import { YoutubeVideos } from '../imports/api/youtubevideos.js';

if (Meteor.isServer) {

    Meteor.publish('items-collection', function (limit) {

        return YoutubeVideos.find({}, { limit: limit , sort: {createdAt: -1}});
    });

} else if (Meteor.isClient) {

    var ITEMS_INCREMENT = 3;
    Session.setDefault('itemsLimit', ITEMS_INCREMENT);
    Deps.autorun(function () {

        Meteor.subscribe('items-collection', Session.get('itemsLimit'));

    });

    Template.collectionPagination.helpers({
        videos: function () {
            return YoutubeVideos.find();
        },
        moreResults: function () {
            // If, once the subscription is ready, we have less rows than we
            // asked for, we've got all the rows in the collection.
            return !(YoutubeVideos.find().count() < Session.get("itemsLimit"));
        }
    });

    function showMoreVisible() {
        var threshold, target = $("#showMoreResults");
        if (!target.length) return;
   
        threshold = $(window).scrollTop() + $(window).height() - target.height();

        if (target.offset().top < threshold) {
            if (!target.data("visible")) {
                // console.log("target became visible (inside viewable area)");
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