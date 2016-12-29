Meteor.startup(function () {
process.env.MAIL_URL = 'smtp://'+process.env.SPARKPOST_SMTP_USERNAME+':'+process.env.SPARKPOST_SMTP_PASSWORD+'@'+process.env.SPARKPOST_SMTP_HOST+':587';
});