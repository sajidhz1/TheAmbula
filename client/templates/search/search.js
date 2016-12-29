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
