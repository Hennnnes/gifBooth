/*THIS FILE IS ONLY NEEDED FOR TESTING*/

// needed for bash script execution
const sys = require('util')
const exec = require('child_process').exec;

// needed for file creation
const fs = require('fs');

function exposeCamera(time, destination){
    exec(`mkdir ${destination} && cd ${destination} && gphoto2 --capture-movie=${time}s && cd ..`);
    setTimeout(() => {
        console.log(`10s of video captured`);
    }, 10000);
}

function generateJPGs(video, destination) {
    // create folder for gif
    exec(`mkdir temp/${destination}`);
    console.log(`folder created temp/${destination}`);

    // create gif
    exec(`ffmpeg -i ${video} -vcodec copy temp/${destination}/out-%d.jpg`);
    console.log(`jpgs generated in folder: temp/${destination}`);
}

// convert jpgs to gif
function createGif(jpgFolder) {
    exec(`ffmpeg -f image2 -i temp/${jpgFolder}/out-%d.jpg created/${jpgFolder}.gif`);
    console.log(`gif created from folder: temp/${jpgFolder}`);
}

function generateFolderName() {
    return `${Date.now()}-${(Math.floor(Math.random() * 10000) + 1)}`
}

//generate folder and declare the movie file
folderName = generateFolderName();
file = 'movie.mjpg';

// main Stuff happens here
generateJPGs(file, folderName);
setTimeout(() => {createGif(folderName)}, 1000);


// exposeCamera(10, 'abctest');
