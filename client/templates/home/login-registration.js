Template.registration.events({
    'submit #signupform': function (e) {
        e.preventDefault();

        var email = trimInput(e.target.email.value);
        var password = trimInput(e.target.password.value);
        var username = trimInput(e.target.username.value);
        var first_name = trimInput(e.target.first_name.value);
        var last_name = trimInput(e.target.last_name.value);
        var confirm = trimInput(e.target.confirm.value);

        var user = {
            email: email,
            username: username,
            password: password,
            profile: {
                first_name: first_name,
                last_name: last_name
            }
        };

        if (isNotEmpty(email) &&
            isNotEmpty(password) &&
            isNotEmpty(first_name) &&
            isNotEmpty(last_name) &&
            isNotEmpty(username) &&
            isEmail(email) &&
            areValidPassword(password, confirm)) {

            Accounts.createUser(user, function (err) {
                if (err) {
                    FlashMessages.sendError(err);
                } else {
                    FlashMessages.sendSuccess('Successfully registered');
                    Router.go('/');
                }
            });

        }

        return false;
    },
      'click .btnfb': function (e) {
        e.preventDefault();
        Meteor.loginWithFacebook({
            requestPermissions: ['user_friends', 'public_profile', 'email']
        }, (err) => {
            if (err) {
            } else {
                Router.go('/');
            }
        });
        return false;
    },
      'click .btngoogle': function (e) {
        e.preventDefault();
        Meteor.loginWithGoogle({
            requestPermissions: ['user_friends', 'public_profile', 'email']
        }, (err) => {
            if (err) {
            } else {
                Router.go('/');
            }
        });
        return false;
    }
});

var trimInput = function (val) {
    return val.replace(/^\s*|\s*$/g, "");
}

isNotEmpty = function (value) {
    if (value && value !== '') {
        return true;
    }
    FlashMessages.sendError('Please fill in all fields');
    return false;
};

isEmail = function (value) {
    var filter = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
    if (filter.test(value)) {
        return true;
    }
    FlashMessages.sendError('Please enter a valid email address');

    return false;
}

areValidPassword = function (password, confirm) {
    if (password.length < 6) {
        FlashMessages.sendError('Password must be atleast 6 characters');
        return false;
    }
    if (password !== confirm) {
        FlashMessages.sendError('passwords do not match');
        return false;
    }

    return true;
}

//login methods

Template.login.events({
    'submit #loginform': function (e) {
        e.preventDefault();
        var email = trimInput(e.target.email.value);
        var password = trimInput(e.target.password.value);

        Meteor.loginWithPassword(email, password, function (err) {
            if (err) {
                // e.target.email.value = email;
                // e.target.password.value = password;
                FlashMessages.sendError(err.reason);
            } else {
                FlashMessages.sendSuccess("You are now Logged In");
                Router.go('/');
            }
        });

        return false;
    },
      'click .btnfb': function (e) {
        e.preventDefault();
        Meteor.loginWithFacebook({
            requestPermissions: ['user_friends', 'public_profile', 'email']
        }, (err) => {
            if (err) {
            } else {
                Router.go('/');
            }
        });
        return false;
    },
      'click .btngoogle': function (e) {
        e.preventDefault();
        Meteor.loginWithGoogle({
            requestPermissions: ['user_friends', 'public_profile', 'email']
        }, (err) => {
            if (err) {
            } else {
                Router.go('/');
            }
        });
        return false;
    }
});

