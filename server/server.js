// requires
const express = require('express');
const bodyParser = require('body-parser');
const fs  = require('fs');
const cors = require('cors');


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

// cross origin
app.use(cors());

// files as static
app.use('/files', express.static('files'));


// routes
app.get('/expose', (req, res) => {
    const name = generateRandomName();
    exposeCamera(name, 10);

    /* TODO get time from headers, insert into cutVideo(percent) */
    // cutVideo(90);

    setTimeout(function() {
	generateJPGs(name);
	console.log(`jpegs generated ${name}`);

        setTimeout(function() {

		createGif(name);
        	console.log(`gif created ${name}`);

        	res.json({
            		message: `Camera exposed.`,
            		path: getGifPath()
        	});
       }, 10000);

    }, 10000);

});

// start Server
app.listen(port, () => {
    console.log('Listen on Port: ' + port);
});

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

/* TODO */
/* prrobably simply rename the last x percent of files based on percentage  */
function cutVideo(percentageKept) {

}

function generateRandomName() {
    return `${Date.now()}-${(Math.floor(Math.random() * 10000) + 1)}`;
}
