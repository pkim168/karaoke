/**
 * Reencode audio & video without creating files first
 *
 * Requirements: ffmpeg, ether via a manual installation or via ffmpeg-static
 *
 * If you need more complex features like an output-stream you can check the older, more complex example:
 * https://github.com/fent/node-ytdl-core/blob/cc6720f9387088d6253acc71c8a49000544d4d2a/example/ffmpeg.js
 */

// Buildin with nodejs
const cp = require('child_process');
const readline = require('readline');
// External modules
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const {join} = require('path');
const fs = require('fs');
var failed = false;

// Trying to download videos too quick/at the same time will result in error due to multiples writing to library.json. To combat, block adding until  download is finished. Can display notification using Toasts from Bootstrap
//Catch all error so server doesn't close on errors

function download(song, library, onComplete, onError) {
  var code = '0000'
  if (library.length !== 0) {
    code = (parseInt(library[library.length-1].code) + 1).toString().padStart(4, '0');
  }

  fs.unlink(join(__dirname,'songs/'+code+'.mp4'), (err) => {
    console.log('Download Start: '+song['title']);
    console.log(song['url']);

    // Global constants
    const ref = song['url'];
    const tracker = {
      start: Date.now(),
      audio: { downloaded: 0, total: Infinity },
      video: { downloaded: 0, total: Infinity },
      merged: { frame: 0, speed: '0x', fps: 0 },
    };

    // Get audio and video streams
    const audio = ytdl(ref, { quality: 'highestaudio' })
      .on('progress', (_, downloaded, total) => {
        tracker.audio = { downloaded, total };
      })
      .on('error', (e) => {
        console.log('ytdl error audio: '+e);
        fs.unlink(join(__dirname,'songs/'+code+'.mp4'), (err) => {
          if (err) {
            console.log(err);
            return;
          }
          // if no error, file has been deleted successfully
          console.log('File deleted!');
        });
        onError(e);
        if (ffmpegProcess) {
          console.log(typeof(ffmpegProcess));
          failed = true;
          ffmpegProcess.kill();
          console.log("ffmpeg exit");
        }
        return;
      });
    const video = ytdl(ref, { quality: 'highestvideo' })
      .on('progress', (_, downloaded, total) => {
        tracker.video = { downloaded, total };
      })
      .on('error', (e) => {
        console.log('ytdl error video: '+e);
        // fs.unlink(join(__dirname,'songs/'+code+'.mp4'), (err) => {
        //   if (err) {
        //     console.log(err);
        //     return;
        //   }
        //   // if no error, file has been deleted successfully
        //   console.log('File deleted!');
        // });
        onError(e);
        if (ffmpegProcess) {
          failed = true;
          ffmpegProcess.kill();
          console.log("ffmpeg exit");
        }
        return;
      });

    // Prepare the progress bar
    let progressbarHandle = null;
    const progressbarInterval = 1000;
    const showProgress = () => {
      readline.cursorTo(process.stdout, 0);
      const toMB = i => (i / 1024 / 1024).toFixed(2);

      process.stdout.write(`Audio  | ${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% processed `);
      process.stdout.write(`(${toMB(tracker.audio.downloaded)}MB of ${toMB(tracker.audio.total)}MB).${' '.repeat(10)}\n`);

      process.stdout.write(`Video  | ${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% processed `);
      process.stdout.write(`(${toMB(tracker.video.downloaded)}MB of ${toMB(tracker.video.total)}MB).${' '.repeat(10)}\n`);

      process.stdout.write(`Merged | processing frame ${tracker.merged.frame} `);
      process.stdout.write(`(at ${tracker.merged.fps} fps => ${tracker.merged.speed}).${' '.repeat(10)}\n`);

      process.stdout.write(`running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(2)} Minutes.`);
      readline.moveCursor(process.stdout, 0, -3);
    };

    // Start the ffmpeg child process
    const ffmpegProcess = cp.spawn(ffmpeg, [
      // Remove ffmpeg's console spamming
      '-loglevel', '8', '-hide_banner',
      // Redirect/Enable progress messages
      '-progress', 'pipe:3',
      // Set inputs
      '-i', 'pipe:4',
      '-i', 'pipe:5',
      // Map audio & video from streams
      '-map', '0:a',
      '-map', '1:v',
      // Keep encoding
      '-c:v', 'copy',
      // Define output file
      join(__dirname,'songs/'+code+'.mp4'),
    ], {
      windowsHide: true,
      stdio: [
        /* Standard: stdin, stdout, stderr */
        'inherit', 'inherit', 'inherit',
        /* Custom: pipe:3, pipe:4, pipe:5 */
        'pipe', 'pipe', 'pipe',
      ],
    });
    ffmpegProcess.on('close', () => {
      // Cleanup
      process.stdout.write('\n\n\n\n');
      clearInterval(progressbarHandle);

      if (failed) {
        onError("ytdl Error");
        console.log('Download Failed: '+ song['title']);
        fs.unlink(join(__dirname,'songs/'+code+'.mp4'), (err) => {
          if (err) {
            console.log(err);
            failed = false;
            return;
          }
          // if no error, file has been deleted successfully
          console.log('File deleted!');
        });
      }
      else {
        console.log('Download Finish: '+ song['title']);
        onComplete({...song, code: code});
      }
      failed = false;

    });
    ffmpegProcess.on('error', (e) => {
      console.log("ffmpegProcess Error: "+e);
      fs.unlink(join(__dirname,'songs/'+code+'.mp4'), (err) => {
        if (err) {
          console.log(err);
          return;
        }
        // if no error, file has been deleted successfully
        console.log('File deleted!');
      });
      onError(e);
    })

    // Link streams
    // FFmpeg creates the transformer streams and we just have to insert / read data
    ffmpegProcess.stdio[3].on('data', chunk => {
      // Start the progress bar
      if (!progressbarHandle) progressbarHandle = setInterval(showProgress, progressbarInterval);
      // Parse the param=value list returned by ffmpeg
      const lines = chunk.toString().trim().split('\n');
      const args = {};
      for (const l of lines) {
        const [key, value] = l.split('=');
        args[key.trim()] = value.trim();
      }
      tracker.merged = args;
    });
    audio.pipe(ffmpegProcess.stdio[4])
      .on('error', (e) => {
        console.log("audio pipe error: "+e)
        onError(e);
      });
    video.pipe(ffmpegProcess.stdio[5])
      .on('error', (e) => {
        console.log("audio pipe error: "+e)
        onError(e);
      });
  });
}

module.exports = download
