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

  // if (!serverIsFree) {
  //     console.log('server already in use');
  //     return;
  // }

  // split message and get values
  console.log(message);
  message = message.split(",");
  if (message[0] != 'expose') {
      console.log('message makes no sense');
      return;
  }

  // Server begins process now
  serverIsFree = false;
  client.publish('testtopic/gifBoothTest', 'status: process started');

  // get parameters from message
  let duration = parseInt(message[1].replace(' ', ''));
  console.log(duration);
  duration = duration + 1;
  console.log(duration);
  let fps = parseInt(message[2].replace(' ', ''));
  const mode = message[3].replace(' ', '');
  const filter = message[4].replace(' ', '');
  const name = generateRandomName();


  // expose camera and log
  removeOldFile('movie.mjpg');
  exposeCamera(duration);
  console.log('camera exposed');

  setTimeout(function() {
      createFolder(name);
      console.log('folder created');
      moveVideo('movie.mjpg', 'files/'+ name +'/movie.mjpg');
      console.log('video moved');

      switch (mode) {
          case 'boomerang':
              reverseMovie(name);
              setTimeout(function() {
                  combineMovies(name);
              }, 6000);
              break;
          case 'reverse':
              reverseMovie(name);
              setTimeout(function() {
                  renameFile('files/' + name + '/reverse.mjpg', 'files/' + name +'/output.mjpg');
              }, 4000);
              break;
          default:
              renameFile('files/' + name + '/movie.mjpg', 'files/' + name +'/output.mjpg');
      }

      setTimeout(function() {
          generateGif(name, fps);
          console.log('gif generated');

          setTimeout(function() {
            if(filter === 'Grey') {
              console.log('filter:', filter);
              exec('ffmpeg -i files/' + name + '/output.gif -vf colorchannelmixer=.299:.587:.114:0:.299:.587:.114:0:.299:.587:.114:0: files/' + name + '/outputFilter.gif');
          } else if(filter === 'Orange') {
              console.log('filter:', filter);
              exec('ffmpeg -i files/' + name + '/output.gif -vf colorchannelmixer=1.5:0.8:0.1:0:0.4:0.7:0.1:0:0:0:0.1:0 files/' + name + '/outputFilter.gif');
          }

          setTimeout(function() {
              if(filter != 'None' ) {
                var data = base64Img.base64Sync('files/' + name + '/outputFilter.gif');
              } else {
                var data = base64Img.base64Sync('files/' + name + '/output.gif');
              }
              console.log('base64 generated');

              setTimeout(function() {
                  client.publish('testtopic/gifBoothTest', data);
                  console.log('Published: ' + data.slice(0,21));
                  serverIsFree = true;
              }, 2000);
          }, 4000);
        }, 4000);
      }, 10000);
  }, 6000);

});


/* Functions */
function logExec(log) {
    console.log('process');
}

function removeOldFile(filename) {
    exec('rm -rf ' + filename, logExec(showLogs));
}

function exposeCamera(duration) {
    exec('gphoto2 --capture-movie='+duration+'s', logExec(showLogs));
}

function createFolder(filename) {
    exec('mkdir files/' + filename, logExec(showLogs));
}

function moveVideo(oldFile, newFile) {
    exec('mv ' + oldFile + ' ' + newFile, logExec(showLogs));
}

function reverseMovie(filename) {
    exec('ffmpeg -i files/' + filename + '/movie.mjpg -vf reverse files/' + filename + '/reverse.mjpg', logExec(showLogs));
}


function renameFile(oldfilename, newfilename) {
    exec('mv '+ oldfilename + ' ' + newfilename, logExec(showLogs));
}

function combineMovies(filename) {
    exec('ffmpeg -i "concat:files/' + filename + '/movie.mjpg|files/' + filename + '/reverse.mjpg" -codec copy files/' + filename + '/output.mjpg', logExec(showLogs));
}

function generateGif(name, fps) {
    // generate gif with custom palette
     exec('ffmpeg -i files/' + name + '/output.mjpg -filter_complex \ "fps=' + fps + ',scale=400:-1" files/' + name + '/output.gif', logExec(showLogs));
}

function generateRandomName() {
    return Date.now() + '-' + (Math.floor(Math.random() * 10000) + 1);
}
