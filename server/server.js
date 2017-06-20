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
  const duration = message[1].replace(' ', '');
  const fps = message[2].replace(' ', '');
  const mode = message[3].replace(' ', '');
  const name = generateRandomName();

  exposeCamera(duration);
  console.log('camera exposed');

  setTimeout(function() {
      createFolder(name);
      moveVideo(name);
      console.log('video moved');

      setTimeout(function() {
          generateGif(name, duration, fps);
          console.log('gif generated');

          setTimeout(function() {
              var data = base64Img.base64Sync('files/' + name + '/output.gif');
              console.log('base generated');

              setTimeout(function() {
                  client.publish('testtopic/gifBoothTest', data);
                  console.log('Published: ' + data.slice(0,21));
              }, 2000);
          }, 4000);
      }, 1000);
  }, 6000);

});


/* Functions */
function exposeCamera(duration) {
    // delete movie if there should be one left
    exec('rm -rf movie.mjpg');

    // expose camera
    exec('gphoto2 --capture-movie='+duration+'s');
}

function createFolder(filename) {
    exec('mkdir files/' + filename);
}

function moveVideo(filename) {
    exec('mv movie.mjpg files/' + filename + '/movie.mjpg');
}

function generateGif(name, duration, fps) {
    // generate gif with custom palette
     exec('ffmpeg -t ' + duration + ' -i files/' + name + '/movie.mjpg -filter_complex \ "fps=' + fps + ',scale=400:-1" files/' + name + '/output.gif');
}

function generateRandomName() {
    return Date.now() + '-' + (Math.floor(Math.random() * 10000) + 1);
}
