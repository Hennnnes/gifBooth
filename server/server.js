// requires
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt:broker.mqttdashboard.com');

const base64Img = require('base64-img');

// to run command line
const sys = require('util')
const exec = require('child_process').exec;

let serverIsFree = true;

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

  if (message === 'free?') {
      client.publish('testtopic/gifBoothTest', 'free: ' + serverIsFree);
  }

  // split message and get values
  message = message.split(",");

  if (message[0] != 'expose') {
      console.log('no expose message');
      return;
  }
  if (!serverIsFree) {
      console.log('server already in use');
      return;
  }

  serverIsFree = false;
  const duration = parseInt(message[1].replace(' ', '')) + 1;
  const fps = message[2].replace(' ', '');
  const mode = message[3].replace(' ', '');
  const name = generateRandomName();

  exposeCamera(duration);
  console.log('camera exposed');

  setTimeout(function() {
      createFolder(name);
      moveVideo(name);
      console.log('video moved');

      if (mode === 'boomerang'){
          reverseMovie(name);
          setTimeout(function() {
              combineMovies(name);
          }, 4000);
      } else if (mode === 'reverse') {
          reverseMovie(name);
          setTimeout(function() {
              renameReverseMovie(name);
          }, 1000);
      } else {
          renameNormalMovie(name);
      }


      setTimeout(function() {
          generateGif(name, duration, fps);
          console.log('gif generated');

          setTimeout(function() {
              var data = base64Img.base64Sync('files/' + name + '/output.gif');
              console.log('base generated');

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
function exposeCamera(duration) {
    // delete movie if there should be one left
    exec('rm -rf movie.mjpg', function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });

    // expose camera
    exec('gphoto2 --capture-movie='+duration+'s', function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
}

function createFolder(filename) {
    exec('mkdir files/' + filename, function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
}

function moveVideo(filename) {
    exec('mv movie.mjpg files/' + filename + '/movie.mjpg', function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
}

function reverseMovie(filename) {
    exec('ffmpeg -i files/' + filename + '/movie.mjpg -vf reverse files/' + filename + '/reverse.mjpg', function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
}

function renameReverseMovie(filename) {
    exec('mv reverse.mjpg output.mjpg', function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
}

function renameNormalMovie(filename) {
    exec('mv movie.mjpg output.mjpg', function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
}

function combineMovies(filename) {
    exec('ffmpeg -i "concat:files/' + filename + '/movie.mjpg|files/' + filename + '/reverse.mjpg" -codec copy files/' + filename + '/output.mjpg', function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
}



function generateGif(name, duration, fps) {
    // generate gif with custom palette
     exec('ffmpeg -t ' + duration + ' -i files/' + name + '/movie.mjpg -filter_complex \ "fps=' + fps + ',scale=400:-1" files/' + name + '/output.gif', function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
}

function generateRandomName() {
    return Date.now() + '-' + (Math.floor(Math.random() * 10000) + 1);
}
