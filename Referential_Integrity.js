var redis = require('redis');
var _ = require('underscore');
var config = require('./config');
var subscriber = redis.createClient(10001, 'localhost' , {no_ready_check: true});
subscriber.on('connect', function() {
    console.log('Connected to Subscriber Redis');
});

var publisher = redis.createClient(10001, 'localhost' , {no_ready_check: true});
publisher.on('connect', function() {
    console.log('Connected to Publisher Redis');
});

console.log(config.update);
host = _.pluck(config, 'host')[0];
console.log(host);

subscriber.on("message", function(channel, message) {
  console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
  console.log(message);
	publisher.publish(("course", JSON.stringify(studentCourseDetails));
  }
}



});

subscriber.subscribe("student");