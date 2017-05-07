const express = require('express');
const bodyParser = require('body-parser');
const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');
const Canvas = require('canvas');
const fs  = require('fs');

const encoder = new GIFEncoder(850, 480);
const app = module.exports = express();
const port = 8080;

// body-parser to get data from post request
app.use(bodyParser.urlencoded({ extended: true}));

// return only json
app.use(bodyParser.json());

app.post('/start', function(req, res) {
    res.json({ message: 'start' });
});

app.post('/create', function(req, res) {
    /* generate link */
    const link = `public/${Date.now()}-${Math.floor((Math.random() * 1000) + 1)}.gif`;

    createGif(link);

    res.json({message: 'Done.', link: link });
});

app.post('/stop', function(req, res) {
    res.json({ message: 'turned off' });
});

// start Server
app.listen(port, () => {
    console.log('Listen on Port: ' + port);
});


function initEncoder(repeat = 0, delay = 100, quality = 10) {
    encoder.start();
    encoder.setRepeat(repeat);
    encoder.setDelay(delay);
    encoder.setQuality(quality);
}

function createGif(fileLink) {
    /* init encoder */
    initEncoder(0, 100, 10);

    /* allow to write file to system  */
    encoder.createReadStream()
        .pipe(fs.createWriteStream(fileLink));

    //  for now use node canvas as a sample
    const canvas = new Canvas(850, 480);
    const ctx = canvas.getContext('2d');

    // red rectangle
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 850, 480);
    encoder.addFrame(ctx);

    // green rectangle
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(0, 0, 850, 480);
    encoder.addFrame(ctx);

    // blue rectangle
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(0, 0, 850, 480);
    encoder.addFrame(ctx);

    // finish it
    encoder.finish();
}
