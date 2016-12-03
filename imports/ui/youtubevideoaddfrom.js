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

    },

    'submit #youtubeVideoAddFormClient': function (event) {
        // Prevent default browser form submit
        event.preventDefault();

        //Get value from form elements
        const target = event.target;

        const video_title = target.video_title.value;
        const video_url = target.video_url.value;
        const recipe_category = $(target.recipe_category).val();

        const video_id = getYouTubeID(video_url);
        const video_description = $('#summernote').summernote('code');


        var newYoutubeVideo = {
            videoId: video_id,
            videoTitle: video_title,
            videoUrl: video_url,
            recipeCategory: recipe_category,
            videoDescription: video_description,
            createdAt: new Date(),
        };

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
                sAlert.success('Successfully Added !');
            }

        });
    },

    'blur #videoUrl': function (event) {

        const target = event.target;
        const video_url = target.value;
        if (matchYoutubeUrl(video_url)) {
            var video_id = getYouTubeID(video_url);

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
            return false;
        }
    },
});
