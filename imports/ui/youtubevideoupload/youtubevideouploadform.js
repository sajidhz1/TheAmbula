/**
 * Created by Dulitha RD on 12/31/2016.
 */
import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';

import './youtubevideouploadform.html';

/**
 * This script uploads a video (specifically `video.mp4` from the current
 * directory) to YouTube,
 *
 * To run this script you have to create OAuth2 credentials and download them
 * as JSON and replace the `credentials.json` file. Then install the
 * dependencies:
 *
 * npm i r-json lien opn bug-killer
 *
 * Don't forget to run an `npm i` to install the `youtube-api` dependencies.
 * */

const Youtube = require("youtube-api")
    , Lien = require("lien")
    , opn = require("opn")
    , prettyBytes = require("pretty-bytes")
    ;

// I downloaded the file from OAuth2 -> Download JSON
//const CREDENTIALS = readJson(`${__dirname}/credentials.json`);

// Init lien server
let server = new Lien({
    host: "localhost"
    , port: 3000
});

// Authenticate
// You can access the Youtube resources via OAuth2 only.
// https://developers.google.com/youtube/v3/guides/moving_to_oauth#service_accounts
let oauth = Youtube.authenticate({
    type: "oauth"
    , client_id: "790490892056-thail57sbqtf33lsf21f37i58658ulmc.apps.googleusercontent.com"
    , client_secret: "qDzeQfnWf4yqOsSNPS3Zjx3P"
    , redirect_url: "http://localhost:3000/oauth2callback"
});

opn(oauth.generateAuthUrl({
    access_type: "offline"
    , scope: ["https://www.googleapis.com/auth/youtube.upload"]
}));


Template.youtubeVideoUploadForm.onCreated(function bodyOnCreated() {
    // Handle oauth2 callback
    server.addPage("/oauth2callback", lien => {
        console.log("Trying to get the token using the following code: " + lien.query.code);
        oauth.getToken(lien.query.code, (err, tokens) => {

            if (err) {
                lien.lien(err, 400);
                return Logger.log(err);
            }

            console.log("Got the tokens.");

            oauth.setCredentials(tokens);

            lien.end("The video is being uploaded. Check out the logs in the terminal.");

            var req = Youtube.videos.insert({
                resource: {
                    // Video title and description
                    snippet: {
                        title: "Testing YoutTube API NodeJS module"
                        , description: "Test video upload via YouTube API"
                    }
                    // I don't want to spam my subscribers
                    , status: {
                        privacyStatus: "private"
                    }
                }
                // This is for the callback function
                , part: "snippet,status"

                // Create the readable stream to upload the video
                , media: {
                    body: fs.createReadStream("video.mp4")
                }
            }, (err, data) => {
                console.log("Done.");
                process.exit();
            });

            setInterval(function () {
                console.log(`${prettyBytes(req.req.connection._bytesDispatched)} bytes uploaded.`);
            }, 250);
        });
    });
});


Template.youtubeVideoUploadForm.events({

    'click #button': function () {
        console.log("Upload Clicked");
    }
});