import { YoutubeVideos } from '../imports/api/youtubevideos.js';


Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notfound'
});


Router.route('/', {
    name: "homeIndex",
    data: function () {
        return {
            message: " Welcome to Ambula"
        }
    }
});


Router.route("/channels/:id", {
    name: "userChannel",
    waitOn: function () {
        Session.set('channel',this.params.id);
        return Meteor.subscribe("user-channel", this.params.id), Meteor.subscribe("search-videos-by-owner", this.params.id);
    },
    data: function () {
         return {
            users:  Meteor.users.find({ _id : this.params.id}).fetch(),
            videos :  YoutubeVideos.find({ owner: this.params.id }).fetch()
        }
    }
    // data: function () {
    //     return {
    //         channel : Meteor.call('getUserChannelProfile', this.params.id, (error, result) => {
    //             if (error) {
    //                 return error;
    //             } else {
    //                 console.log(result);
    //                 return result;
    //             }
    //         })
    //     }
    // }
});

Router.route("/search/", {
    name: "searchResults",
    waitOn: function () {
        var str = decodeURIComponent(this.params.query.q);
        return Meteor.subscribe("search-videos", str);
    },
    data: function () {
        var str = decodeURIComponent(this.params.query.q);

        return {
            videos: YoutubeVideos.find({ videoTitle: { $regex: ".*" + str + ".*", $options: 'i' } }).fetch()
        }

    }
});

Router.route('/editProfile', {
    name: "profileEdit"
});

Router.route('/item1', {
    name: "homeItem1"
});

Router.route('/item2', {
    name: "homeItem2"
});

Router.route('/addrecipevideo', {
    name: "youtubeVideoAddForm"
});

Router.route('/profile', {
    name: "userProfile",
    waitOn: function () {
        return Meteor.subscribe("search-videos-by-owner", Meteor.userId());
    },
    data: function () {
        return {
            videos: YoutubeVideos.find({ owner: Meteor.userId() }).fetch()
        }
    }
});

Router.route('/login', {
    name: "login"
});

Router.route('/registration', {
    name: "registration"
});


Router.onBeforeAction(function () {
    if (!Meteor.user() && !Meteor.loggingIn()) {
        this.redirect('/login');
    } else {
        // required by Iron to process the route handler
        this.next();
    }
}, {
        except: ['homeIndex', 'login', 'registration']
    });

Router.route('/singlerecipevideoview', {
    name: "youtubeVideoViewComp"
});