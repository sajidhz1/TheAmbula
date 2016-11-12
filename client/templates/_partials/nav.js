//inject type ahead when navbar is loaded
Template.nav.rendered = function() {
  Meteor.typeahead.inject();
};

//Nba = new Meteor.Collection("youtubevideos");

Template.nav.helpers({
   search : function(query, sync, callback) {
      Meteor.call('search', query, {}, function(err, res) {
        if (err) {
          console.log(err);
          return;
        }
        
        callback(res.map(function(v){ return {value: v.videoTitle}; }));
      });
    }
 
});