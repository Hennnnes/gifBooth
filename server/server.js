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
app.post('/expose', (req, res) => {
    const name = generateRandomName();
    exposeCamera(name, 10);

    /* TODO get time from headers, insert into cutVideo(percent) */
    // cutVideo(90);

    generateJPGs(name);
    const path = createGif(name);

    res.json({
        message: `Camera exposed.`,
        path: path
    });
});

// start Server
app.listen(port, () => {
    console.log('Listen on Port: ' + port);
});


/* Functions */
/* TODO put in different file */
function exposeCamera(path, time = 10) {
    exec(`gphoto2 --capture-movie=${time}s`);
    exec(`mkdir ${path}`);
    exec(`mv movie.mjpg ${path}/movie.mjpg`);

    setTimeout(() => {
        console.log(`10s of video captured`);
    }, (time * 1000) );
}

function generateJPGs(path) {
    // create folder for gif
    exec(`mkdir temp/${path}`);

    // create jpgs in folder path
    exec(`ffmpeg -i temp/${path} -vcodec copy temp/${path}/out-%d.jpg`);
}

function createGif(path) {
    exec(`ffmpeg -f image2 -i temp/${path}/out-%d.jpg created/${path}.gif`);
    return `created/${path}.gif`;
}


/* TODO */
/* prrobably simply rename the last x percent of files based on percentage  */
function cutVideo(percentageKept) {

}

function generateRandomName() {
    return `${Date.now()}-${(Math.floor(Math.random() * 10000) + 1)}`;
}
