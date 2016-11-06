Template._loginButtonsLoggedInDropdownActions.onRendered(function () {

  // Validate user exists and YOUR ELEMENT is not already in place
  if (Meteor.user() && $('#YOUR_ELEMENT').length === 0) {

    // Inject YOUR ELEMENT before the 'Change password' button
    $('#login-buttons-open-change-password').before('<div class="login-button" id="YOUR_ELEMENT"><a href="#" class="btn btn-default btn-block" id="login-buttons-open-account-page">Profile</a></div>');

    // EXTRA: Attach an event to YOUR ELEMENT
    $('#login-buttons-open-account-page').on('click', function (e) {
      e.preventDefault();
      Router.go('userProfile');
    });
  }
});

Template.userProfile.events({
  // Submit signup form event
  'submit form': function (e, t) {
    // Prevent default actions
    e.preventDefault();

    var file = $('#userimage')[0].files[0];
    console.log(file)
    Cloudinary.upload(file, function (err, res) {
      console.log("Upload Error: " + err);
      console.log("Upload Result: " + res.public_id);

      Meteor.users.update(Meteor.userId(), {$set: {"profile.user_avatar": res.public_id}});
    });
  },

  'change #userimage': function (e) {
    e.preventDefault();
    var reader = new FileReader();
    var file = $('#userimage')[0].files[0]
    reader.onload = function (e) {
        // get loaded data and render thumbnail.
        document.getElementById("profPic").src = e.target.result;
    };
    // read the image file as a data URL.
    reader.readAsDataURL(file);

    //visiblity of the buttons
    $('#inputArea').hide();
    $('#saveButton').show();
    $('#cancelButton').show();
  }
});