import {YoutubeVideos} from '../imports/api/youtubevideos.js';

import '../client/templates/search/search-result-tile.html';

if (Meteor.isClient) {

    getSearchResults = function (text) {
        Meteor.call("getSearchResults", text);
    };


}

if (Meteor.isServer) {
    Meteor.methods({
        search: function (query, options) {
            options = options || {};

            // guard against client-side DOS: hard limit to 50
            if (options.limit) {
                options.limit = Math.min(50, Math.abs(options.limit));
            } else {
                options.limit = 50;
            }

            // TODO fix regexp to support multiple tokens
            var regex = new RegExp("^" + query);
            return YoutubeVideos.find({videoTitle: {$regex: query, $options: '-i'}}).fetch();

        }
    });
}

Template.searchTile.events({
    'click .search-view-dlete': function (event) {

        event.preventDefault();

        Modal.show('recipeDeleteConfirmBox', {
            videoIdToDelete: this._id,
            videoOwner: this.owner
        });

    },

    'click .search-view-edit': function (event) {

        event.preventDefault();

        Router.go('youtubeVideoUpdateForm', {videoId: this._id});

    },
});

Template.searchTile.helpers({
    isOwner: function () {
        return this.owner === Meteor.userId();
    }
});
