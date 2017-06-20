// requires
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt:broker.mqttdashboard.com');

const base64Img = require('base64-img');

// to run command line
const sys = require('util')
const exec = require('child_process').exec;

client.on('connect', function () {
  client.subscribe('testtopic/gifBoothTest');
  console.log('connected to testtopic/gifBoothTest')
})

client.on('disconnected', function () {
  console.log('disconnected')
})


/* message format: ['expose', duration, fps, mode] */
client.on('message', function (topic, message) {
  // message is Buffer
  message = message.toString();

  const messageIsGif = (message.slice(0,21) === 'data:image/gif;base64');
  if (messageIsGif) {
      console.log('received gif');
  }

  // split message and get values
  message = message.split(",");
  if (message[0] != 'expose') {
      console.log('no expose message');
      return;
  }
  const duration = message[1].parseInt();
  const fps = message[2].parseInt();
  const mode = message[3];
  const name = generateRandomName();

  // ensure variables are in range
  duration = (duration < 1) ? 1 : duration;
  duration = (duration > 5) ? 5 : duration;
  fps = (fps < 2) ? 2 : fps;
  fps = (fps > 8) ? 8 : fps;
  mode = (mode === 'normal' || mode === 'boomerang') ? mode : 'normal';


  // actiooooon
  setTimeout(function() {
    exposeCamera(duration);

    setTimeout(function() {
        createFolder(name);
        moveVideo(name);

        setTimeout(function() {
            generateGif(name, duration, fps);

            // wait because it takes it's time
            setTimeout(function() {
                // var data = base64Img.base64Sync('files/' + name + '/output.gif');
                var data = base64Img.base64Sync('files/' + name + '/output.gif');

                // publish data to topic
                client.publish('testtopic/gifBoothTest', data);
                console.log('Published: ' + data.slice(0,21));
            }, 500);
        }, 1000);

    }, 500);
  }, duration * 100);

});


/* Functions */
function exposeCamera(duration) {
    // delete movie if there should be one left
    exec('rm -rf movie.mjpg');

    // expose camera
    exec('gphoto2 --capture-movie=' + duration + 's');
}

function createFolder(filename) {
    exec('mkdir files/' + filename);

}

function moveVideo(filename) {
    exec('mv movie.mjpg files/' + filename + '/movie.mjpg');
    // if mp4
    // exec('mv movie.mp4 files/' + filename + '/movie.mp4');
}

function generateGif(name, duration, fps) {
    // generate gif with custom palette
     exec('ffmpeg -t ' + duration + ' -i files/' + name + '/movie.mp4 -filter_complex \ "fps=' + fps + ',scale=400:-1" files/' + name + '/output.gif');
}

function generateRandomName() {
    return Date.now() + '-' + (Math.floor(Math.random() * 10000) + 1);
}
