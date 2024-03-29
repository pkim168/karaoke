module.exports = (io, db) => {
  const {join} = require('path');
  const fs = require('fs');
  var library = db.library.find();
  var download = require('./videoDL.js');
  var queue = [];
  var userArr = [];
  var host = "";
  var playing = false;
  var stopped = false;
  var downloading = false;

  io.on("connection", (socket) => {
    if (userArr.length < 4) {
      if (host === "") {
        console.log("Host connected: ", socket.id);
        host = socket;
        socket.emit("connection", "host");
      }
      else {
        console.log("User connected: ", socket.id);
        userArr.push(socket);
        socket.emit("connection", "user");
      }
      socket.emit("library", library);
      socket.emit("queue", queue);
    }
    else {
      console.log("Force Disconnect: Too many users");
      socket.disconnect();
    }
    socket.on('disconnect', () => {
      if (host === socket) {
        console.log("Host disconnected", socket.id);
        for (var j=0; j < userArr.length; j++) {
          userArr[j].emit("close");
        }
        host = "";
        queue = [];
        playing = false;
        stopped = false;
      }
      else {
        var i = userArr.indexOf(socket);
        console.log("User disconnected", socket.id);
        userArr.splice(i, 1);
      }
    });
    socket.on('playSong', () => {
      console.log("Play Song")
      if (!playing && stopped && queue.length) {
        io.emit('play', queue[0])
        queue.splice(0, 1);
        io.emit('queue', queue);
        playing = true;
        stopped = false;
      }

    });
    socket.on('skipSong', () => {
      console.log("Skip Song")
      if (!stopped && playing) {
        if (queue.length) {
          io.emit('play', queue[0])
          queue.splice(0, 1);
          io.emit('queue', queue);
        }
        else {
          io.emit('play', false);
          playing = false;
        }
      }
    });
    socket.on('stopSong', () => {
      console.log("Stop Song")
      console.log(playing)
      console.log(stopped)
      if (playing && !stopped) {
        playing = false;
        stopped = true;
        io.emit('play', false);
        io.emit('stop');
      }
    });
    socket.on('addQueue', (song) => {
      console.log('Add Queue: '+song['code'])
      queue.push(song);
      if (queue.length && !playing && !stopped) {
        io.emit('play', queue[0]);
        playing = true;
        queue.splice(0, 1);
      }
      io.emit('queue', queue);
    });
    socket.on('removeQueue', (index) => {
      console.log('Remove Queue: '+queue[index]['code'])
      queue.splice(index, 1);
      io.emit('queue', queue);
    });
    socket.on('addLibrary', (song) => {
      if (!downloading) {
        downloading = true;
        io.emit('addProgress', ['start', 'Currently Downloading: '+song['title']]);
        download(song, library, (song) => {
          console.log('Adding to Library: '+ song['title']);
          db.library.save({
            code: song['code'],
            title: song['title'],
            artist: song['artist'],
            // tags: song['tags'],
            url: 'songs/'+song['code']+'.mp4'
          });
          console.log('Adding Finish: '+ song['title']);
          library = db.library.find();
          downloading = false;
          socket.emit('addSuccess', song['title']+" successfully added to library");
          io.emit('addProgress', ['end', 'Download Finished']);
          io.emit('library', library);
        }, (error) => {
          downloading = false;
          console.log(error);
          socket.emit('addFail', "Failed to add "+song['title']+" to library");
          io.emit('addProgress', ['end', 'Download Failed']);
        });
      }
      else {
        socket.emit('addFail', 'Another song is currently being downloaded. Try again later');
      }
    })
    socket.on('editLibrary', (song) => {
      db.library.update({code: song.code}, {title: song.title, artist: song.artist});
      library = db.library.find();
      io.emit('library', library);
    })
    socket.on('deleteSong', (song) => {
      fs.unlink(join(__dirname,'songs/'+song.code+'.mp4'), (err) => {
        if (err) {
          console.log(err);
          io.emit('addProgress', ['end', 'Download Failed']);
          // failed = false;
          return;
        }
        // if no error, file has been deleted successfully
        db.library.remove({code: song.code});
        library = db.library.find();
        console.log('Song deleted!');
        io.emit('library', library);
      });
    })
    socket.on('songEnd', () => {
      console.log('Song End')
      if (queue.length) {
        io.emit('play', queue[0])
        queue.splice(0, 1);
        io.emit('queue', queue);
      }
      else {
        playing = false;
        io.emit('play', false);
      }
    })
    socket.on('speed', (direction, pbr) => {
      console.log('Speed ' + direction);
      io.emit('speed', direction, pbr)
    })
  })
}
