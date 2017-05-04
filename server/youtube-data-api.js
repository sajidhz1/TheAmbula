/**
 * Created by Dulitha RD on 11/9/2016.
 */
import {HTTP} from 'meteor/http';

var Future = Npm.require('fibers/future');
var cloudinaryUrl = 'http://res.cloudinary.com/hwshbhsyq/image/upload/';
/**
 * Replace this with your target API or use the API URLs directly in the methods below.
 * @type {string}
 */
var baseUrl = 'https://www.googleapis.com/youtube/v3/videos?id=UprcpdwuwCg&key=AIzaSyCjLSnxF3A8c38xz62aWdFZRZWeRfmMf18&fields=items(id,snippet(channelId,title,description))&part=snippet';


Meteor.methods({

    /**
     * Just executes a simple HTTP request (synchronously on the server side)
     *
     * @returns the data returned from the API.
     */
    simpleGetData: function () {
        var response = HTTP.get(baseUrl);
        return response.data;
    },

    /**
     * Appends the parameter as new path element to the base URL and invokes a GET request.
     * @param param - the parameter to append
     * @returns the data returned from the API
     */
    getWithParameter: function (param) {
        // Create our future instance.
        var future = new Future();

        var baseUrlWithParam = 'https://www.googleapis.com/youtube/v3/videos?id=' + param + '&key=AIzaSyCjLSnxF3A8c38xz62aWdFZRZWeRfmMf18&fields=items(id,snippet(channelId,title,description))&part=snippet'
        HTTP.get(baseUrlWithParam, {}, function (error, response) {
            if (error) {
                future.return(error);
            } else {
                future.return(response);
            }
        });
        return future.wait();

    },

    /**
     * To check whether an actual image exists in cloudinary server with the given image id from db
     * @imageId imageId - the public image id saved in to the db when uploading it to cloudinary
     * @returns the imageId if it is really there
     */
    checkIfImageExists: function (imageId) {
        check(imageId, String);
        var url = cloudinaryUrl + imageId;
        var fut = new Future();
        this.unblock();
        HTTP.get(url, function (error, result) {
            if (error) {
                console.log('Error: ' + error);
                fut.return(false);
            } else {
                console.log('Result: ' + result);
                fut.return(true);
            }
        });
        return fut.wait();
    }
});