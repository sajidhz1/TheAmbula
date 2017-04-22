/**
 * Created by Dulitha RD on 4/13/2017.
 */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Articles } from './../../api/article.js';

import './articleaddform.html';

Template.articleAddForm.onRendered(function () {

    var dataContext = Template.currentData();

    $(document).ready(function () {
        $('#articleBody').summernote({
            height: 500,
            maxHeight: 500,
            minHeight: 500,
            toolbar: [
                // [groupName, [list of button]]
                ['style', ['bold', 'italic', 'underline', 'clear']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['fontNames', ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['link', 'table', 'hr']],
                ['misc', ['undo', 'redo', 'fullscreen', 'help']]
            ],
            placeholder: 'Video Description'
        });
    });
});

Template.articleAddForm.helpers({
    errors: function () {
        var context = Articles.simpleSchema().namedContext("insertForm");

        return context.invalidKeys().map(function (data) {
            return { field: data.name, message: context.keyErrorMessage(data.name) }
        });

    },

    equals: function (v1, v2) {
        return (v1 === v2);
    }
});

Template.articleAddForm.events({
    'click #cancel': function (event) {

        event.preventDefault();

        Router.go('/profile');
    },

    'submit #addArticleForm': function (event) {
        event.preventDefault();

        //Get value from form elements
        let target = event.target;
        let article_title = target.article_title.value;
        let article_type = $(target.article_type).val();
        let article_body = $('#articleBody').summernote('code');

        var newArticle = {
            articleTitle: article_title,
            articleBody: article_body,
            articleType: article_type,
            createdAt: new Date()
        };

        try {
            // Insert a article into the collection
            Meteor.call('articles.insert', newArticle, function (error, result) {

                if (error) {
                    console.log(error);
                } else {
                    // Clear form
                    target.article_title.value = '';
                    $('#articleType').val('');
                    $('#articleBody').summernote('reset');

                    Bert.alert({
                        hideDelay: 6000,
                        title: 'Article Was Successfully Submitted',
                        message: 'Your article is now safe with theambula.lk',
                        type: 'success',
                        style: 'growl-top-right',
                        icon: 'fa-floppy-o fa-2x'
                    });

                    console.log('article ' + result);
                    /*TODO redirect to new article which was just saved*/
                    Router.go('/article/'+result);
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

});

Template.dropzone.onRendered(function () {
    var options = _.extend({}, Meteor.Dropzone.options, this.data);
    console.log("dropzone rendered");

    // if your dropzone has an id, you can pinpoint it exactly and do various client side operations on it.
    if (this.data.id) {

        var self = this;

        this.dropzone.on('sending', function (file, xhr, formData) {
            formData.append('file', file);
            formData.append('api_key', 765487893716384);
            formData.append('timestamp', Date.now() / 1000 | 0);
            formData.append('upload_preset', 'testPreset');

        });

        // this is how you get the response from the ajax call.
        this.dropzone.on('success', function (file, response) {
            console.log(response);
            $(file.previewTemplate).append('<span class="server_file">' + response.public_id + '</span>');
        });

        this.dropzone.on('removedfile', function (file, response) {
            var server_file = $(file.previewTemplate).children('.server_file').text();
            Cloudinary.delete(server_file, function (error, response) {
                if (error) {
                    console.log(error);
                }
            });
        });

        this.dropzone.on('error', function (file, response) {
            console.log(response);
        });
    } else {
        this.$('.dropzone').dropzone(options);
    }
});