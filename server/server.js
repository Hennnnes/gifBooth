// requires
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt:broker.mqttdashboard.com');

const base64Img = require('base64-img');

// to run command line
const sys = require('util')
const exec = require('child_process').exec;


/* TODO: sollte später vom client kommen! */
client.on('connect', function () {
  client.subscribe('testtopic/1')
  //client.publish('testtopic/1', 'expose, 5, 20, normal')
})


/*
message format:
[duration, framerate, fps, mode]
sample:
['expose', 5, 20, 'normal']
*/

client.on('message', function (topic, message) {
  // message is Buffer
  message = message.toString();

  // split message and get values
  message = message.split(",");
  if (message[0] != 'expose') {
      console.log('no expose message');
      return;
  }

  const duration = message[1];
  const fps = message[2];
  const mode = message[3];
  const name = generateRandomName();

  // actiooooon
  //	exposeCamera(duration);
  moveFile(name);
  generateGif(name, duration, fps);

  // wait because it takes it's time
  setTimeout(function() {
      var data = base64Img.base64Sync('files/' + name + '/output.gif');
	
      // publish data to topic
      client.publish('testtopic/image', data);

      //client.end();
  }, 500);
});


/* Functions */
function exposeCamera(duration) {
    // delete movie if there should be one left
    exec('rm -rf movie.mjpg');

    // expose camera
    exec('gphoto2 --capture-movie=' + duration + 's');
}

function moveFile(filename) {
    exec('mkdir files/' + filename);
    exec('mv movie.mp4 files/' + filename + '/movie.mp4');
}

function generateGif(name, duration, fps) {
    // generate gif with custom palette
     exec('ffmpeg -t ' + duration + ' -i files/' + name + '/movie.mp4 -filter_complex \ "fps=' + fps + ',scale=400:-1" files/' + name + '/output.gif');
}

function generateRandomName() {
    return Date.now() + '-' + (Math.floor(Math.random() * 10000) + 1);
}
