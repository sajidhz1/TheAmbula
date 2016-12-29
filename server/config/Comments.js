Comments.config({
    onEvent: (name, action, payload) => {
        var message = ""
        if(action =="add"){
            message = "commented on your post"
        }else{
            message = "liked your comment"
        }
      
        Meteor.call('youtubevideo.user', payload.referenceId, function(error, result) {
            if (error) {
                console.log(error)
            } else {
                Meteor.call('newNotification', payload.referenceId, result , message, function(error, result) {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log('notification added');
                    }
                });
            }
        });

    }
});