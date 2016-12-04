Meteor.startup(function () {
  $('#menu ul').hide();
  $('#menu ul').children('.current').parent().show();
  //$('#menu ul:first').show();
  $('#menu li a').click(
    function () {
      var checkElement = $(this).next();
      if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
        return false;
      }
      if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
        $('#menu ul:visible').slideUp('normal');
        checkElement.slideDown('normal');
        return false;
      }
    }
  );

});

Template.nav.events({
  'click #menu-toggle': function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
  }
});

Template.nav.events({
  'click #menu-toggle-2': function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled-2");
    $('#menu ul').hide();
  }
});


Template.sideNav.onCreated(function () {
  this.distinct = new ReactiveVar();
  Meteor.call('usersHasVideos', (error, result) => {
    if (error) {
      console.log(error);
    } else {
      Meteor.call('getUserObjects' ,result , (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
          this.distinct.set(result); // save result when we get it
        }
      });
    }
  });
});

Template.sideNav.helpers({
  users: function () {
    const userNames = Template.instance().distinct.get();
    // turn our array of project values into an array of {project: project}
    return _.map(userNames, userObject => {

      return { userObject }
    });
  }
});

Template.registerHelper('not_equals', function (a, b) {
      return a !== b;
    });