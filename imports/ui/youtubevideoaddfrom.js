/**
 * Created by Dulitha RD on 11/6/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {YoutubeVideos} from '../api/youtubevideos.js';

var getYouTubeID = require('get-youtube-id');

import './youtubevideoaddfrom.html'


/**
 * The reactive variable holding the API data.
 * @type {ReactiveVar}
 */
Template.youtubeVideoAddForm.apiData = new ReactiveVar();
Template.youtubeVideoAddForm.ytVideoTitle = new ReactiveVar();
Template.youtubeVideoAddForm.ytVideoDescription = new ReactiveVar();

/**
 * function to determine whether a given url is a valid url for a youtube video
 * @param url
 * @returns {boolean}
 */
function matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var matches = url.match(p);
    if (matches) {
        return true;
    }
    return false;
}

//Every time the template rendered
Template.youtubeVideoAddForm.onRendered(function () {
    $(document).ready(function () {
        $('#summernote').summernote({
            height: 150,
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

});

Template.youtubeVideoAddForm.helpers({

    videoTitle: function () {
        return Template.youtubeVideoAddForm.ytVideoTitle.get();
    },

    errors: function () {
        var context = YoutubeVideos.simpleSchema().namedContext("insertForm");

        return context.invalidKeys().filter(function (item) {
            if (item.name != 'videoId') {
                return item;
            }
        }).map(function (data) {
            return {field: data.name, message: context.keyErrorMessage(data.name)}
        });

    },

    equals: function (v1, v2) {
        return (v1 === v2);
    }

});

Template.youtubeVideoAddForm.events({
    'click #cancel': function () {
        Template.youtubeVideoAddForm.ytVideoTitle.set(null);
        Template.youtubeVideoAddForm.ytVideoDescription.set(null);
        $('#summernote').summernote('reset');
    },

    'submit #youtubeVideoAddFormClient': function (event) {
        // Prevent default browser form submit
        event.preventDefault();

        //Get value from form elements
        let target = event.target;

        let video_title = target.video_title.value;
        let video_url = target.video_url.value;
        let recipe_category = $(target.recipe_category).val();
        let recipe_vegan = document.getElementById('recipeVegan').checked;

        let video_id = getYouTubeID(video_url);
        let video_description = $('#summernote').summernote('code');

        var newYoutubeVideo = {
            videoId: video_id,
            videoTitle: video_title,
            videoUrl: video_url,
            recipeCategory: recipe_category,
            vegan: recipe_vegan,
            videoDescription: video_description,
            createdAt: new Date(),
        };

        try {
            Meteor.call('youtubevideos.exist', video_id, function (error, result) {
                if (!result) {
                    // Insert a youtubevideo into the collection
                    Meteor.call('youtubevideos.insert', newYoutubeVideo, function (error, result) {

                        if (error) {
                            //console.log(error);
                        } else {
                            Template.youtubeVideoAddForm.ytVideoTitle.set(null);
                            Template.youtubeVideoAddForm.ytVideoDescription.set(null);

                            // Clear form
                            target.video_title.value = '';
                            target.video_url.value = '';
                            $('#summernote').summernote('reset');

                            Modal.hide('youtubeVideoAddForm');
                            Bert.alert({
                                hideDelay: 6000,
                                title: 'Recipe Successfully Submitted',
                                message: 'Your recipe is now safe with theambula.lk',
                                type: 'success',
                                style: 'growl-top-right',
                                icon: 'fa-floppy-o fa-2x'
                            });
                        }

                    });
                } else {
                    Bert.alert({
                        hideDelay: 7000,
                        message: 'This video already exist in theambula.lk, Please try a new one',
                        type: 'ambula-info',
                        style: 'fixed-top',
                        icon: 'fa-info-circle fa-2x'
                    });
                }
            });
        } catch (e) {
            Bert.alert({
                hideDelay: 5000,
                message: 'Something went wrong, please try again later!',
                type: 'danger',
                style: 'fixed-top',
                icon: 'fa-exclamation-triangle fa-2x'
            });
        }

    },

    'blur #videoUrl': function (event) {

        const target = event.target;
        const video_url = target.value;
        if (matchYoutubeUrl(video_url)) {
            var video_id = getYouTubeID(video_url);
            try {
                Meteor.call('youtubevideos.exist', video_id, function (error, result) {
                    if (!result) {
                        Meteor.call('getWithParameter', video_id, function (error, response) {
                            if (error) {
                                // If our API returned an error, we'd see it in the console.
                                console.log(error);
                            } else {
                                Template.youtubeVideoAddForm.apiData.set(response);

                                var responseData = Template.youtubeVideoAddForm.apiData.get();
                                var vidData = responseData['data']['items'][0]['snippet'];

                                Template.youtubeVideoAddForm.ytVideoTitle.set(vidData['title']);
                                Template.youtubeVideoAddForm.ytVideoDescription.set(vidData['description']);

                                $('#summernote').summernote('editor.insertText', Template.youtubeVideoAddForm.ytVideoDescription.get());

                            }
                        });
                    } else {
                        Bert.alert({
                            hideDelay: 7000,
                            message: 'This video already exist in theambula.lk, Please try a new one',
                            type: 'ambula-info',
                            style: 'fixed-top',
                            icon: 'fa-info-circle fa-2x'
                        });
                    }
                });
            } catch (e) {
                Bert.alert({
                    hideDelay: 5000,
                    message: 'Something went wrong, please try again later!',
                    type: 'danger',
                    style: 'fixed-top',
                    icon: 'fa-exclamation-triangle fa-2x'
                });
            }
        } else {
            Template.youtubeVideoAddForm.ytVideoTitle.set(null);
            Template.youtubeVideoAddForm.ytVideoDescription.set(null);
            $('#summernote').summernote('reset');
            return false;
        }
    },
});
