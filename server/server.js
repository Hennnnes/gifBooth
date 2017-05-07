const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');
const Canvas = require('canvas');
const fs  = require('fs');

const encoder = new GIFEncoder(850, 480);
encoder.createReadStream()
    .pipe(fs.createWriteStream('myanimated.gif'));

encoder.start();
encoder.setRepeat(0);
encoder.setDelay(100);
encoder.setQuality(10);

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
