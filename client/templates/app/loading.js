Template.loading.rendered = function () {
  if ( ! Session.get('loadingSplash') ) {
    this.loading = window.pleaseWait({
      logo: 'images/icons/favicon-96x96.png',
      backgroundColor: '#795548',
      loadingHtml: message + spinner
    });
    Session.set('loadingSplash', true); // just show loading splash once
  }
};

Template.loading.destroyed = function () {
  if ( this.loading ) {
    this.loading.finish();
  }
};

var message = '<p class="loading-message"><h2>Please Wait</h2></p>';
var spinner = '<div class="sk-spinner sk-spinner-rotating-plane"></div>';