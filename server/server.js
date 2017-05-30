// requires
const express = require('express');
const bodyParser = require('body-parser');
const fs  = require('fs');

// to run command line
const sys = require('util')
const exec = require('child_process').exec;

// env vars
const app = module.exports = express();
const port = 8080;
 	
// body-parser to get data from post request
app.use(bodyParser.urlencoded({ extended: true}));

// return only json
app.use(bodyParser.json());

// routes
app.get('/expose', (req, res) => {
    const name = generateRandomName();
    exposeCamera(name, 10);

    /* TODO get time from headers, insert into cutVideo(percent) */
    // cutVideo(90);

    generateJPGs(name);
    setTimeout(() => {createGif(name)}, 10000);

    res.json({
        message: `Camera exposed.`,
    });
});

// start Server
app.listen(port, () => {
    console.log('Listen on Port: ' + port);
});

/* TODO put general functions in different file */

// folder structure
/*
  *  - files
  *     - zufaelliger Dateiname mit Datum
  *        - video
  *          - video.gif
  *        - frames
  *          - einzelne jpg Datei der Frames benannt nach out-XYZ.jpg
  *        - ergebnis Gif
  */

/* Functions */
function initEnv() {
    // create initial file folder
    exec(`mkdir files`);
}

function exposeCamera(path, time = 10) {
    exec(`gphoto2 --capture-movie=${time}s`);
    exec(`mkdir files/${path}`);
    exec(`mkdir files/${path}/movie`);
    exec(`mv movie.mjpg files/${path}/movie/movie.mjpg`);

    setTimeout(() => {
        console.log(`10s of video captured`);
    }, (time * 1000) );
}

function generateJPGs(path) {
    // create folder for gif
    exec(`mkdir files/${path}/frames`);

    // create jpgs in folder path
    exec(`ffmpeg -t 5 -i files/${path}/movie/movie.mjpg -vf fps=5 files/${path}/frames/out-%d.jpg`);
}

function createGif(path) {
    exec(`ffmpeg -f image2 -framerate 5 -i files/${path}/frames/out-%d.jpg files/${path}/${path}.gif`);
    console.log(`gif created`);
    return `files/${path}/${path}.gif`;
}

/* TODO */
/* prrobably simply rename the last x percent of files based on percentage  */
function cutVideo(percentageKept) {

}

function generateRandomName() {
    return `${Date.now()}-${(Math.floor(Math.random() * 10000) + 1)}`;
}
