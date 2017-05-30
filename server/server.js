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

// file path var
let gifPath = ``;

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
    setTimeout(() => {
        createGif(name);


        /* TODO Error Handling */


        res.json({
            message: `Camera exposed.`,
            path: getGifPath()
        });

    }, 10000);
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
function exposeCamera(path, time = 10) {
    exec(`gphoto2 --capture-movie=${time}s`);
    exec(`mkdir files/${path}`);
    exec(`mkdir files/${path}/movie`);
    exec(`mv movie.mjpg files/${path}/movie/movie.mjpg`);

    setTimeout(() => {
        console.log(`10s of video captured`);
    }, (time * 1000) );
}

function generateJPGs(path, length = 10, fps = 5) {
    // create folder for gif
    exec(`mkdir files/${path}/frames`);

    // create jpgs in folder path
    /* TODO: Was passiert hier?? */
    exec(`ffmpeg -t ${length} -i files/${path}/movie/movie.mjpg -vf fps=${fps} files/${path}/frames/out-%d.jpg`);
}

function createGif(path, fps = 5) {
    setGifPath(`files/${path}/${path}.gif`);

    exec(`ffmpeg -f image2 -framerate ${fps} -i files/${path}/frames/out-%d.jpg ${getGifPath()}`);
}

function setGifPath(path) {
    gifPath = path;
}

function getGifPath() {
    return gifPath;
}

/* TODO */
/* prrobably simply rename the last x percent of files based on percentage  */
function cutVideo(percentageKept) {

}

function generateRandomName() {
    return `${Date.now()}-${(Math.floor(Math.random() * 10000) + 1)}`;
}
