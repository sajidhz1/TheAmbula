Template.postTile.events({
  'click .panel-google-plus > .panel-footer > .input-placeholder, .panel-google-plus > .panel-google-plus-comment > .panel-google-plus-textarea > button[type="reset"]': function (e) {
    var $panel = $(this).closest('.panel-google-plus');
            $comment = $panel.find('.panel-google-plus-comment');
            
        $comment.find('.btn:first-child').addClass('disabled');
        $comment.find('textarea').val('');
        
        $panel.toggleClass('panel-google-plus-show-comment');
        
        if ($panel.hasClass('panel-google-plus-show-comment')) {
            $comment.find('textarea').focus();
        }
  }
});

Template.postTile.events({
  'keyup .panel-google-plus-comment > .panel-google-plus-textarea > textarea': function (e) {
     var $comment = $(this).closest('.panel-google-plus-comment');
        
        $comment.find('button[type="submit"]').addClass('disabled');
        if ($(this).val().length >= 1) {
            $comment.find('button[type="submit"]').removeClass('disabled');
        }
  }
});

Template.postTile.helpers({
   createdDate : function(date){
     return moment(date).format('MMMM Do YYYY, h:mm:ss a');
   }
});