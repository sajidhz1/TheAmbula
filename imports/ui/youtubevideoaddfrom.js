/**
 * Created by Dulitha RD on 11/6/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './youtubevideoaddfrom.html'

Template.youtubevideoaddfrom.events({
    'submit #youtubeVideoAddForm'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const text = target.video_title.value;

        // Insert a task into the collection
        //Meteor.call('tasks.insert', text);
        console.log(text);
        // Clear form
        target.text.value = '';
    },

    'change .hide-completed input'(event, instance){
        instance.state.set('hideCompleted', event.target.checked);
    },
});