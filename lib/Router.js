import { YoutubeVideos } from '../imports/api/youtubevideos.js';


Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notfound',
    onAfterAction: function () {
        console.log('toggled');
        if ($('.navbar-collapse').hasClass('in')) {
            $('.navbar-toggle').click();
        }
    }
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
        Session.set('channel', this.params.id);
        return Meteor.subscribe("user-channel", this.params.id), Meteor.subscribe("search-videos-by-owner", this.params.id);
    },
    data: function () {
        return {
            users: Meteor.users.find({ _id: this.params.id }).fetch(),
            videos: YoutubeVideos.find({ owner: this.params.id }).fetch()
        }
    }
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

Router.route('/forgotPassword', {
    name: 'ForgotPassword'

});

Router.route('/#/reset-password/:token', {
    name: 'ResetPassword',
});

Router.onBeforeAction(function () {
    if (!Meteor.user() && !Meteor.loggingIn()) {
        this.redirect('/login');
    } else {
        // required by Iron to process the route handler
        this.next();
    }
}, {
        except: ['homeIndex', 'login', 'registration', 'userChannel', 'searchResults', 'youtubeVideoViewComp', 'ForgotPassword', 'ResetPassword']
    });


Router.route('/recipe/:videoId', {
    name: "youtubeVideoViewComp",
    waitOn: function () {
        return Meteor.subscribe("get-ytvideo-by-id", this.params.videoId);
    },
    data: function () {
        return {
            video: YoutubeVideos.find({ _id: this.params.videoId }).fetch()[0]
        }
    }
});

Router.route('/verify-email/:token', {
    name: 'verify-email',
    action(params) {
        Accounts.verifyEmail(params.token, (error) => {
            if (error) {
                sAlert.alert(error.reason);
            } else {
                sAlert.alert('Email verified! Thanks!', {
                    effect: 'slide', position: 'bottom-right', timeout: '3000', onRouteClose: false, stack: false, offset: '80px',
                    onClose: function () {
                        Router.go('/');
                    }
                });
            }
        });
    }
});

Router.route('/editrecipevideo/:videoId', {
    name: "youtubeVideoUpdateForm",
    waitOn: function () {
        return Meteor.subscribe("get-ytvideo-by-id", this.params.videoId);
    },
    data: function () {
        return {
            video: YoutubeVideos.find({ _id: this.params.videoId }, {
                fields: {
                    _id: 1,
                    videoTitle: 1,
                    recipeCategory: 1,
                    videoDescription: 1
                }
            }).fetch()[0]
        }
    }
});