var library = require('./library.json');
const express = require('express');
const http = require('http');
const fs = require('fs');
const ytdl = require('ytdl-core');
// var socketIo = require('socket.io');
// var commands = require('./commands.js');
var cors = require("cors");
var db = require('diskdb');
db = db.connect('db', ['library']);
const router = express.Router();

const port = process.env.PORT || 4000;

const app = express();
app.set('port', port);
app.use(cors());

const server = http.createServer(app);

app.use('/songs/:id', (req, res) => {
  // console.log('routed');
  const path = `songs/${req.params.id}.mp4`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1;
        const chunksize = (end-start) + 1;
        const file = fs.createReadStream(path, {start, end});
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }

});

const io = require('socket.io')(server, {cors: {
  origin: true,
  methods: ['GET', 'POST']
}
});
require('./socket.js')(io);

server.listen(port, () => {
  // Tell us what port it's running on
  console.log("Karaoke server started on " + port)
});

const getApiAndEmit = "TODO";

module.exports = app;
