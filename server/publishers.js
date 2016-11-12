
//
Meteor.publish("searchVideos", function (text) {
  check(text, String);
  return [
    Rooms.find({_id: roomId}, {fields: {secretInfo: 0}}),
    Messages.find({roomId: roomId})
  ];
});