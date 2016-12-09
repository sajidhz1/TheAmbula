/**
 * Created by Dulitha RD on 12/5/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {YoutubeVideos} from '../../api/youtubevideos.js';

import './youtubevideoupdateform.html';

Template.youtubeVideoUpdateForm.onRendered(function () {
    var dataContext = Template.currentData();

    $(document).ready(function () {
        $('#videoDescriptionUpdt').summernote({
            height: 300,
            maxHeight: 300,
            minHeight: 300,
            toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']]
            ],
            placeholder: 'Video Description'
        });
    });

    $("#recipeCategoryUpdt").val(dataContext.video.recipeCategory);
});


Template.youtubeVideoUpdateForm.events({
    'click #cancel': function (event) {

        event.preventDefault();

        Router.go('youtubeVideoViewComp', {videoId: this.video._id});
    },

    'submit #editRecipeVideo': function (event) {
        event.preventDefault();

        const video_id = this.video._id;

        //Get value from form elements
        const target = event.target;

        const video_title = target.updt_video_title.value;
        const recipe_category = $(target.updt_recipe_category).val();
        const video_description = $('#videoDescriptionUpdt').summernote('code');

        Meteor.call('youtubevideos.update', video_id, video_title, recipe_category, video_description, function (error, result) {
            if (result) {
                sAlert.success('Successfully Updated !');
                Router.go('youtubeVideoViewComp', {videoId: video_id});
            } else {
                sAlert.error('Something went wrong while updating!', configOverwrite);
                console.log(error);
            }
        });

    },
});