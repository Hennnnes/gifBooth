// requires
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt:broker.mqttdashboard.com');

const base64Img = require('base64-img');

// to run command line
const sys = require('util')
const exec = require('child_process').exec;
const showLogs = true;
let serverIsFree = true;


/* MQTT on connect to topic */
client.on('connect', function () {
    client.subscribe('testtopic/gifBoothTest');
    console.log('connected to testtopic/gifBoothTest')
});

/* MQTT in disconnected */
client.on('disconnected', function () {
    console.log('disconnected');
});

client.on('message', function (topic, message) {
  // message is Buffer
  message = message.toString();

  const messageIsGif = (message.slice(0,21) === 'data:image/gif;base64');
  if (messageIsGif) {
      console.log('received gif');
  }

  if (message === 'free?') {
      client.publish('testtopic/gifBoothTest', 'free: ' + serverIsFree);
  }

  if (!serverIsFree) {
      console.log('server already in use');
      return;
  }

  // split message and get values
  message = message.split(",");
  if (message[0] != 'expose') {
      console.log('message makes no sense');
      return;
  }

  // Server begins process now
  serverIsFree = false;
  client.publish('testtopic/gifBoothTest', 'status: process started');

  // get parameters from message
  const duration = parseInt(message[1].replace(' ', '')) + 1;
  const fps = message[2].replace(' ', '');
  const mode = message[3].replace(' ', '');
  const name = generateRandomName();

  // expose camera and log
  removeOldFile('movie.mjpg');
  exposeCamera(duration);
  console.log('camera exposed');

  setTimeout(function() {
      createFolder(name);
      moveVideo('movie.mjpg', 'files/'+ name +'/movie.mjpg');
      console.log('video moved');

      switch (mode) {
          case 'boomerang':
              reverseMovie(name);
              setTimeout(function() {
                  combineMovies(name);
              }, 4000);
              break;
          case 'reverse':
              reverseMovie(name);
              setTimeout(function() {
                  renameFile('reverse.mjpg', 'output.mjpg');
              }, 1000);
              break;
          default:
              renameFile('movie.mjpg', 'output.mjpg');
      }

      setTimeout(function() {
          generateGif(name, duration, fps);
          console.log('gif generated');

          setTimeout(function() {
              var data = base64Img.base64Sync('files/' + name + '/output.gif');
              console.log('base64 generated');

              setTimeout(function() {
                  client.publish('testtopic/gifBoothTest', data);
                  console.log('Published: ' + data.slice(0,21));
                  serverIsFree = true;
              }, 2000);
          }, 4000);
      }, 1000);
  }, 6000);

});


/* Functions */
function logExec(log, error, stdout, stderr) {
    if (!log) {
        return;
    }

    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
}

function removeOldFile(filename) {
    exec('rm -rf ' + filename, logExec(showLogs, error, stdout, stderr));
}

function exposeCamera(duration) {
    exec('gphoto2 --capture-movie='+duration+'s', logExec(showLogs, error, stdout, stderr));
}

function createFolder(filename) {
    exec('mkdir files/' + filename, logExec(showLogs, error, stdout, stderr));
}

function moveVideo(oldFile, newFile) {
    exec('mv 'oldFile + ' ' + newFile, logExec(showLogs, error, stdout, stderr));
}

function reverseMovie(filename) {
    exec('ffmpeg -i files/' + filename + '/movie.mjpg -vf reverse files/' + filename + '/reverse.mjpg', logExec(showLogs, error, stdout, stderr));
}


function renameFile(oldfilename, newfilename) {
    exec('mv '+ oldfilename + ' ' + newfilename, logExec(showLogs, error, stdout, stderr));
}

function renameNormalMovie(filename) {
    exec('mv ', logExec(showLogs, error, stdout, stderr));
}

function combineMovies(filename) {
    exec('ffmpeg -i "concat:files/' + filename + '/movie.mjpg|files/' + filename + '/reverse.mjpg" -codec copy files/' + filename + '/output.mjpg', logExec(showLogs, error, stdout, stderr));
}

function generateGif(name, duration, fps) {
    // generate gif with custom palette
     exec('ffmpeg -t ' + duration + ' -i files/' + name + '/movie.mjpg -filter_complex \ "fps=' + fps + ',scale=400:-1" files/' + name + '/output.gif', logExec(showLogs, error, stdout, stderr));
}

function generateRandomName() {
    return Date.now() + '-' + (Math.floor(Math.random() * 10000) + 1);
}
