Mongo.resources.insert({
      event_id: event_id,
      poster: comment_poster,
      message: comment_message
    }, function(err) {
        console.log("comment posted")
    });