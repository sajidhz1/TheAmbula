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
  //  $(document).ready(function() {});