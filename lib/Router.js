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


Router.route("/channels/:sku", {
  name : "userChannel",
  // waitOn : function(){
  //   return Meteor.subscribe("products-by-sku", this.params.sku);
  // },
  data : function(){
    return {
      message : this.params.sku
    }
  }
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

Router.route('/profile',  {
  name :"userProfile"
});

Router.route('/login',  {
  name :"login"
});

Router.onBeforeAction(function () {
    if (!Meteor.user() && !Meteor.loggingIn()) {
        this.redirect('/login');
    } else {
        // required by Iron to process the route handler
        this.next();
    }
}, {
    except: ['homeIndex','login']
});

Router.route('/singlerecipevideoview',{
    name: "youtubeVideoViewComp"
});