// requires
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt:broker.mqttdashboard.com');

// to run command line
const sys = require('util')
const exec = require('child_process').exec;


client.on('connect', function () {
  client.subscribe('testtopic/1')
  client.publish('testtopic/1', '5, 20, normal')
})


/*
message format:
[duration, framerate, fps, mode]
sample:
[5, 20, 'normal']
*/

client.on('message', function (topic, message) {
  // message is Buffer
  message = message.toString();
  message = message.split(",");

  const duration = message[0];
  const fps = message[1];
  const mode = message[2];
  const name = generateRandomName();

  // exposeCamera(duration);
  moveFile(name);
  generateGif(name, duration, fps);

  client.end()
})

/* Functions */
function exposeCamera(duration) {
    // delete movie if there should be one left
    exec(`rm -rf movie.mjpg`);

    // expose camera
    exec(`gphoto2 --capture-movie=${duration}s`);
}

function moveFile(filename) {
    exec(`mkdir files/${filename}`);
    exec(`mv movie.mjpg files/${filename}/movie.mjpg`);
}

function generateGif(name, duration, fps) {
    // generate gif with custom palette
    exec(`ffmpeg -t ${duration} -i files/${name}/movie.mjpg -filter_complex \
"fps=${fps},scale=400:-1" files/${name}/output.gif`);
}

function generateRandomName() {
    return `${Date.now()}-${(Math.floor(Math.random() * 10000) + 1)}`;
}
