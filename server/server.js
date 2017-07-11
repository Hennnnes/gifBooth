// requires
const mqtt = require('mqtt');
var options = {
	username: 'haw',
	password: 'schuh+-0',
}

const client = mqtt.connect('mqtt:diginet.mt.haw-hamburg.de', options);

const base64Img = require('base64-img');

// to run command line
const sys = require('util')
const exec = require('child_process').exec;
const showLogs = true;
let serverIsFree = true;

/* MQTT on connect to topic */
client.on('connect', function() {
    client.subscribe('testtopic/gifBoothTest');
	client.publish('testtopic/gifBoothTest', 'expose, 3, 5, boomerang,');
    console.log('connected to testtopic/gifBoothTest')
});

/* MQTT in disconnected */
client.on('disconnected', function() {
    console.log('disconnected');
});

client.on('message', function(topic, message) {
    // frontend check if server is free, publish mqtt msg
    if (message === 'free?') {
        client.publish('testtopic/gifBoothTest', 'free: ' + serverIsFree);
    }

    // return if server is in use
    if (!serverIsFree) {
        console.log('server already in use');
        return;
    }

    // convert message from buffer to string
    message = message.toString();

    // split message and get values
    console.log(message);
    message = message.split(",");
    if (message[0] != 'expose') {
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

    // remove old file
    exec(removeOldFile('movie.mjpg'), function(err, stdout, stderr) {
        if (err) {
            return err;
        } else {
            // expose camera for given duration
            exec(exposeCamera(duration), function(err, stdout, stderr) {
                if (err) {
                    return err;
                } else {

                    // create folder to move file to
                    exec(createFolder(name), function(err, stdout, stderr) {
                        if (err) {
                            return err;
                        } else {

                            exec(moveVideo('movie.mjpg', 'files/' + name + '/movie.mjpg'), function(err, stdout, stderr) {
                                if (err) {
                                    return err;
                                } else {

                                    switch (mode) {
                                        case 'boomerang':
											exec(reverseMovie(name), function(err, stdout, stderr) {
												if (err) {
													return err;
												} else {
													exec(combineMovies(name), function(err, stdout, stderr) {
														if (err) { return err; } else {
															exec(generateGif(name, fps), function(err, stdout, stderr) {
																if (err) {
																	return err;
																} else {
																	exec(applyFilter(name, filter), function(err, stdout, stderr) {
																		if(err) {
																			return err;
																		} else {
																			var data = base64Img.base64Sync('files/' + name + '/outputFilter.gif');

																			// publish final message
																			client.publish('testtopic/gifBoothTest', data);
																			console.log('Published: ' + data.slice(0, 21));
																			serverIsFree = true;
																		}
																	});

																};
															});
														}
													});
												}
											});
                                        case 'reverse':
                                            if (reverseMode(name)) {
                                                break;
                                            } else {
                                                return 'reverse action error';
                                            }
                                        default:
                                            if (normalMode(name)) {
                                                break;
                                            } else {
                                                return 'normal mode error';
                                            }
                                    }

                                    exec(generateGif(name, fps), function(err, stdout, stderr) {
                                        if (err) {
                                            return err;
                                        } else {
                                            if (!applyFilter(name, filter)) {
                                                // break because error in applyFilter
                                                return 'error in apply filter';
                                            } else {
                                                var data = base64Img.base64Sync('files/' + name + '/outputFilter.gif');

                                                // publish final message
                                                client.publish('testtopic/gifBoothTest', data);
                                                console.log('Published: ' + data.slice(0, 21));
                                                serverIsFree = true;
                                            };
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

/* MODE Functions */
function boomerangMode(name) {
    exec(reverseMovie(name), function(err, stdout, stderr) {
        if (err) {
            return err;
        } else {
            exec(combineMovies(name), function(err, stdout, stderr) {
                if (err) { return err; } else {
                    return true;
                }
            });
        }
    });
}

function reverseMode(name) {
    exec(reverseMovie(name), function(err, stdout, stderr) {
        if (err) {
            return err;
        } else {
            exec(renameFile('files/' + name + '/reverse.mjpg', 'files/' + name + '/output.mjpg'), function(err, stdout, stderr) {
                if (err) { return err; } else {
                    return true;
                }
            });
        }
    });
}

function normalMode(name) {
    exec(renameFile('files/' + name + '/movie.mjpg', 'files/' + name + '/output.mjpg'), function(err, stdout, stderr) {
        if (err) {
            return err;
        } else {
            return true;
        }
    });
}

/* filter functions */
function applyFilter(name, filter) {
    var command = '';
    switch (filter) {
        case 'Grey':
            command = 'ffmpeg -i files/' + name + '/output.gif -vf colorchannelmixer=.299:.587:.114:0:.299:.587:.114:0:.299:.587:.114:0: files/' + name + '/outputFilter.gif';
            break;
        case 'Orange':
            command = 'ffmpeg -i files/' + name + '/output.gif -vf colorchannelmixer=1.5:0.8:0.1:0:0.4:0.7:0.1:0:0:0:0.1:0 files/' + name + '/outputFilter.gif';
            break;
        default:
            command = 'mv files/' + name + '/output.gif files/' + name + '/outputFilter.gif';
    }

	return command;
}

/* Functions */
function removeOldFile(filename) {
    //return 'rm -rf ' + filename;
}

function exposeCamera(duration) {
    //return 'gphoto2 --capture-movie=' + duration + 's';
}

function createFolder(filename) {
    return 'mkdir files/' + filename;
}

function moveVideo(oldFile, newFile) {
    return 'mv ' + oldFile + ' ' + newFile;
}

function reverseMovie(filename) {
    return 'ffmpeg -i files/' + filename + '/movie.mjpg -vf reverse files/' + filename + '/reverse.mjpg';
}

function renameFile(oldfilename, newfilename) {
    return 'mv ' + oldfilename + ' ' + newfilename;
}

function combineMovies(filename) {
    return 'ffmpeg -i "concat:files/' + filename + '/movie.mjpg|files/' + filename + '/reverse.mjpg" -codec copy files/' + filename + '/output.mjpg';
}

function generateGif(name, fps) {
    return 'ffmpeg -i files/' + name + '/output.mjpg -filter_complex \ "fps=' + fps + ',scale=400:-1" files/' + name + '/output.gif';
}

function generateRandomName() {
    return Date.now() + '-' + (Math.floor(Math.random() * 10000) + 1);
}
