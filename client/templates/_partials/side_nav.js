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
  this.recipeCount = new ReactiveVar();

  Meteor.call('getUserRecipeCount', (error, result)  => {
    if (error) {
      console.log(error);
    } else {
      this.recipeCount.set(result);

      var userIdArray = result.map(function(a) {return a.owner.owner;});
      Meteor.call('getUserObjects', userIdArray, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          this.distinct.set(result); // save result when we get it
        }
      });
    }
  });
});

Template.sideNav.helpers({
  users: function () {

    const userObjects = Template.instance().distinct.get();
    const userRecipeCountObjects = Template.instance().recipeCount.get();
    // turn our array of project values into an array of {project: project}
    return _.map(userRecipeCountObjects, function (userRecipeCountObject) {
      return _.extend(userRecipeCountObject , _.omit(_.findWhere(userObjects, { _id: userRecipeCountObject.owner.owner }), 'id'));
    });
  }
});

Template.registerHelper('not_equals', function (a, b) {
  return a !== b;
});

