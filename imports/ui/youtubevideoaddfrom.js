/**
 * Created by Dulitha RD on 11/6/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

var getYouTubeID = require('get-youtube-id');

import './youtubevideoaddfrom.html'


/**
 * The reactive variable holding the API data.
 * @type {ReactiveVar}
 */
Template.youtubeVideoAddForm.apiData = new ReactiveVar();
Template.youtubeVideoAddForm.ytVideoTitle = new ReactiveVar();
Template.youtubeVideoAddForm.ytVideoDescription = new ReactiveVar();


Template.youtubeVideoAddForm.helpers({

    /**
     * Same as for the simple API get example, this helper is executed twice, first time returning undefined,
     * second time it will return the API data.
     * @returns {any}
     */
    // getApiData: function() {
    //     if (Template.youtubeVideoAddForm.apiData.get() === undefined) {
    //         refreshGetData();
    //     }
    //     return Template.youtubeVideoAddForm.apiData.get();
    // },

    videoTitle: function () {
        return Template.youtubeVideoAddForm.ytVideoTitle.get();
    },

    videoDesc: function () {
        return Template.youtubeVideoAddForm.ytVideoDescription.get();
    }

});

Template.youtubeVideoAddForm.events({
    'submit #youtubeVideoAddFormClient': function (event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const video_title = target.video_title.value;
        const video_url = target.video_url.value;
        const video_description = target.video_description.value;

        // Insert a youtubevideo into the collection
        Meteor.call('youtubevideos.insert', video_title, video_url, video_description, function (error, response) {
            if (error) {
                console.log(error)
            } else {
                Template.youtubeVideoAddForm.ytVideoTitle.set(null);
                Template.youtubeVideoAddForm.ytVideoDescription.set(null);
            }
        });

        // Clear form
        target.video_title.value = '';
        target.video_url.value = '';
        target.video_description.value = '';
    },

    'blur #videoUrl': function (event) {

        const target = event.target;
        const video_url = target.value;

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

            }
        });

    }
});
