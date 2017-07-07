// requires
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt:broker.mqttdashboard.com');

const base64Img = require('base64-img');

// to run command line
const sys = require('util')
const exec = require('child_process').exec;
const showLogs = true;
let serverIsFree = true;

var riesenArray = [];


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
  console.log('test');

  // get parameters from message
  let duration = parseInt(message[1].replace(' ', '')) + 1;
  let fps = parseInt(message[2].replace(' ', ''));
  const mode = message[3].replace(' ', '');
  const filter = message[4].replace(' ', '');
  const name = generateRandomName();


  // expose camera and log
  removeOldFile('movie.mjpg');
  exposeCamera(duration);
  console.log('camera exposed');

  createFolder(name);
  console.log('folder created');
  moveVideo('movie.mjpg', 'files/'+ name +'/movie.mjpg');
  console.log('video moved');

  switch (mode) {
      case 'boomerang':
          reverseMovie(name);
          combineMovies(name);
          break;
      case 'reverse':
          reverseMovie(name);
          renameFile('files/' + name + '/reverse.mjpg', 'files/' + name +'/output.mjpg');
          break;
      default:
          renameFile('files/' + name + '/movie.mjpg', 'files/' + name +'/output.mjpg');
  }

    generateGif(name, fps);
    console.log('gif generated');

    if(filter === 'filterGrey') {
      console.log('filter:', filter);
      addToArray('ffmpeg -i files/' + name + '/output.gif -vf colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3 files/' + name + '/outputFilter.gif');
    } else if(filter === 'filterBlue') {
      console.log('filter:', filter);
      addToArray('ffmpeg -i files/' + name + '/output.gif -vf colorchannelmixer=1.5:.0:.0:0:-.3:-.4:-.3:0:.0:.0:1.5 files/' + name + '/outputFilter.gif');
    }


    execCommands(createStringFromArray(riesenArray), function() {
        generateBaseAndPublish(filter, name, client);
    });
});


/* Functions */
function logExec(log) {
    console.log('process');
}

function addToArray(command) {
    riesenArray.push(command);
}

function createStringFromArray(array) {
    var string = '';
    for (var i = 0; i < array.length; i++) {
        if (i != (array.length -1)) {
            string += array[i] + ' && ';
        } else {
            string += array[i];
        }

    }
    return string;
}

function execCommands(command, callback) {
    exec(command);
    callback();
}

function generateBaseAndPublish(filter, name, client) {
    setTimeout(function() {
        if(filter != 'filterNormal' ) {
          var data = base64Img.base64Sync('files/' + name + '/outputFilter.gif');
        } else {
          var data = base64Img.base64Sync('files/' + name + '/output.gif');
        }
        console.log('base64 generated');

        setTimeout(function() {
            client.publish('testtopic/gifBoothTest', data);
            console.log('Published: ' + data.slice(0,21));
        }, 2000);
    }, 4000);
}

function removeOldFile(filename) {
    addToArray('rm -rf ' + filename);
}

function exposeCamera(duration) {
    addToArray('gphoto2 --capture-movie='+duration+'s');
}

function createFolder(filename) {
    addToArray('mkdir files/' + filename);
}

function moveVideo(oldFile, newFile) {
    addToArray('mv ' + oldFile + ' ' + newFile);
}

function reverseMovie(filename) {
    addToArray('ffmpeg -i files/' + filename + '/movie.mjpg -vf reverse files/' + filename + '/reverse.mjpg');
}


function renameFile(oldfilename, newfilename) {
    addToArray('mv '+ oldfilename + ' ' + newfilename);
}

function combineMovies(filename) {
    addToArray('ffmpeg -i "concat:files/' + filename + '/movie.mjpg|files/' + filename + '/reverse.mjpg" -codec copy files/' + filename + '/output.mjpg');
}

function generateGif(name, fps) {
    // generate gif with custom palette
    addToArray('ffmpeg -i files/' + name + '/output.mjpg -filter_complex \ "fps=' + fps + ',scale=400:-1" -framerate ' + Math.round(fps/2) + ' files/' + name + '/output.gif');
}

function generateRandomName() {
    return Date.now() + '-' + (Math.floor(Math.random() * 10000) + 1);
}
