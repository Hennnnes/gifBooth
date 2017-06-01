// requires
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt:broker.mqttdashboard.com');

// to run command line
const sys = require('util')
const exec = require('child_process').exec;


client.on('connect', function () {
  client.subscribe('testtopic/1')
  client.publish('testtopic/1', '5, 10, 20, normal')
})


/*
message format:
[duration, framerate, fps, mode]
sample:
[5, 10, 20, 'normal']
*/

client.on('message', function (topic, message) {
  // message is Buffer
  message = message.toString();
  message = message.split(",");

  const duration = message[0];
  const framerate = message[1];
  const fps = message[2];
  const mode = message[3];
  const name = generateRandomName();

  exposeCamera(duration);

  // wait until camera is exposed
  setTimeout(function() {
    generateJPGs(name);

    // wait until jpegs are generated
    setTimeout(function() {
        createGif(name);
    }, duration * 100);

  }, duration * 1000);

  client.end()
})

// file path var
let gifPath = ``;

/* Functions */
function exposeCamera(path, time) {
    exec(`rm -rf movie.mjpg`);
    exec(`gphoto2 --capture-movie=10s`);
    setTimeout(function() {
        exec(`mkdir files/${path}`);
        exec(`mkdir files/${path}/movie`);

        exec(`mv movie.mjpg files/${path}/movie/movie.mjpg`);
    }, 10000 );

    console.log(`camera exposed`);
}

function generateJPGs(path) {
    // create folder for gif
    exec(`mkdir files/${path}/frames`);

    // create jpgs in folder path
    exec(`ffmpeg -t 5 -i files/${path}/movie/movie.mjpg -vf fps=5 files/${path}/frames/out-%d.jpg`);

    console.log(`jpegs generated`);
}

function createGif(path) {
    setGifPath(`files/${path}/${path}.gif`);

    exec(`ffmpeg -f image2 -framerate 5 -i files/${path}/frames/out-%d.jpg ${getGifPath()}`);

    console.log(`gif created`);
}

function setGifPath(path) {
    gifPath = path;
}

function getGifPath() {
    return gifPath;
}

function generateRandomName() {
    return `${Date.now()}-${(Math.floor(Math.random() * 10000) + 1)}`;
}
