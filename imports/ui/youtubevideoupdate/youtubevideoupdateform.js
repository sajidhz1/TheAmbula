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
    document.getElementById("recipeVeganUpdt").checked = dataContext.video.vegan;
});


Template.youtubeVideoUpdateForm.events({
    'click #cancel': function (event) {

        event.preventDefault();

        Router.go('youtubeVideoViewComp', {videoId: this.video._id});
    },

    'submit #editRecipeVideo': function (event) {
        event.preventDefault();

        let video_id = this.video._id;

        //Get value from form elements
        let target = event.target;

        let video_title = target.updt_video_title.value;
        let recipe_category = $(target.updt_recipe_category).val();
        let recipe_vegan = document.getElementById('recipeVeganUpdt').checked;

        let video_description = $('#videoDescriptionUpdt').summernote('code');

        Meteor.call('youtubevideos.update', video_id, video_title, recipe_category, recipe_vegan, video_description, function (error, result) {
            if (result) {
                Bert.alert({
                    hideDelay: 5000,
                    title: 'Recipe Successfully Updated',
                    message: 'your recipe at theambula.lk content was successfully updated',
                    type: 'success',
                    style: 'growl-top-right',
                    icon: 'fa-flag fa-2x'
                });
                Router.go('youtubeVideoViewComp', {videoId: video_id});
            } else {
                Bert.alert({
                    hideDelay: 7000,
                    message: 'Something went wrong while updating the recipe, please try again later!',
                    type: 'danger',
                    style: 'fixed-top',
                    icon: 'fa-exclamation-triangle fa-2x'
                });
                console.log(error);
            }
        });

    },
});