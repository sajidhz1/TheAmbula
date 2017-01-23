Accounts.config({
  sendVerificationEmail: true,
  forbidClientAccountCreation: false
});

// Accounts.emailTemplates.siteName = "TheAmbula";
Accounts.emailTemplates.from = "postmaster@mail.theambula.lk";

Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "[TheAmbula] Verify Your Email Address";
  },
  text(user, url) {
    let emailAddress = user.emails[0].address,
      urlWithoutHash = url.replace('#/', ''),
      supportEmail = "support@theambula.com",
      emailBody = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

    return emailBody;
  }
};

Meteor.startup(function () {
  Accounts.loginServiceConfiguration.remove({
    service: 'facebook'
  });

  Accounts.loginServiceConfiguration.insert({
    service: 'facebook',
    appId: process.env.FACEBOOK_APPID,
    secret: process.env.FACEBOOK_APP_SECRET
  });

  Accounts.loginServiceConfiguration.remove({
    service: "google"
  });
  Accounts.loginServiceConfiguration.insert({
    service: "google",
    clientId: '390686010514-35p9mre1m7v0521ibhvr36jub1vqcjch.apps.googleusercontent.com',
    secret: 'qHcOFBDmi8DA_QfQOY3Oz7yl'
  });

  
});
