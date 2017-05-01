import {YoutubeVideos} from '../imports/api/youtubevideos.js';
import {Articles} from '../imports/api/article.js';

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notfound',
    onAfterAction: function () {
        console.log('toggled');
        if ($('.navbar-collapse').hasClass('in')) {
            $('.navbar-toggle').click();
        }
    },
    waitOn: function () {
        Meteor.subscribe('notifications');
    },
    trackPageView: true
});

Router.route('/', {
    name: "homeIndex",
    data: function () {
        return {
            message: " Welcome to Ambula"
        }
    },

});

Router.route("/channels/:id", {
    name: "userChannel",
    waitOn: function () {
        Session.set('channel', this.params.id);
        return Meteor.subscribe("user-channel", this.params.id), Meteor.subscribe("search-videos-by-owner", this.params.id);
    },
    data: function () {
        return {
            users: Meteor.users.find({_id: this.params.id}).fetch(),
            videos: YoutubeVideos.find({owner: this.params.id}).fetch()
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
            videos: YoutubeVideos.find({videoTitle: {$regex: ".*" + str + ".*", $options: 'i'}}).fetch()
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
    waitOn: function () { //Return an array of subscribes when you want to return multiple subscribes in iron route 'waiton'
        return [
            Meteor.subscribe("search-videos-by-owner", Meteor.userId()),
            Meteor.subscribe("search-articles-by-owner", Meteor.userId())
        ];
    },
    data: function () {
        return {
            videos: YoutubeVideos.find({owner: Meteor.userId()}).fetch(),
            articles: Articles.find({}).fetch()
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
    except: ['homeIndex', 'login', 'registration', 'userChannel', 'searchResults', 'youtubeVideoViewComp', 'ForgotPassword', 'ResetPassword', 'articleViewComp']
});


Router.route('/recipe/:videoId', {
    name: "youtubeVideoViewComp",
    waitOn: function () {
        return Meteor.subscribe("get-ytvideo-by-id", this.params.videoId);
    },
    data: function () {
        return {
            video: YoutubeVideos.find({_id: this.params.videoId}).fetch()[0]
        }
    },
    onAfterAction: function () {
        if (!Meteor.isClient) {
            return;
        }
        var post = this.data().video;

        document.title = post.videoTitle;

        SEO.set({
            title: post.videoTitle,
            meta: {
                'description': post.videoDescription
            },
            og: {
                'title': post.videoTitle,
                'description': post.videoDescription,
                'image': 'https://img.youtube.com/vi/' + post.videoId + '/hqdefault.jpg'
            }
        });
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
                    effect: 'slide',
                    position: 'bottom-right',
                    timeout: '3000',
                    onRouteClose: false,
                    stack: false,
                    offset: '80px',
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
            video: YoutubeVideos.find({_id: this.params.videoId}, {
                fields: {
                    _id: 1,
                    videoTitle: 1,
                    recipeCategory: 1,
                    vegan: 1,
                    videoDescription: 1,
                }
            }).fetch()[0]
        }
    }
});

Router.route('/addarticle', {
    name: 'articleAddForm'
});

Router.route('/article/:articleId', {
    name: 'articleViewComp',
    waitOn: function () {
        return Meteor.subscribe("get-article-by-id", this.params.articleId);
    },
    data: function () {
        return {
            article: Articles.find({_id: this.params.articleId}).fetch()[0]
        }
    }
})