Template._loginButtonsLoggedInDropdownActions.onRendered(function() {

  // Validate user exists and YOUR ELEMENT is not already in place
  if (Meteor.user() && $('#YOUR_ELEMENT').length === 0) {

    // Inject YOUR ELEMENT before the 'Change password' button
    $('#login-buttons-open-change-password').before('<div class="login-button" id="YOUR_ELEMENT"><a href="#" class="btn btn-default btn-block" id="login-buttons-open-account-page">Profile</a></div>');

    // EXTRA: Attach an event to YOUR ELEMENT
    $('#login-buttons-open-account-page').on('click', function(e) {
        e.preventDefault();
       Router.go('userProfile');
    });
  }
});