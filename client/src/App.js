import React, { useRef, useState, useEffect } from 'react';
import Home from './components/Home.js';
import Host from './components/Host.js';
import User from './components/User.js';
import { Toast } from 'react-bootstrap';
//Do i need to include this line in every file that uses socket even when ive passed through props?
var socketClient = require('socket.io-client');

function App() {
  const socket = useRef(null);
  const role = useRef(null);
  const flag = useRef(true);
  const [page, setPage] = useState("home");
  const [library, setLibrary] = useState([]);
  const [queue, setQueue] = useState([]);
  const [play, setPlay] = useState(false);
  const [stop, setStop] = useState(false);
  const [song, setSong] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState("");
  const [showFailed, setShowFailed] = useState(false);
  const [failed, setFailed] = useState("");
  const [playbackRate, setPlaybackRate] = useState(1);
  const path = useRef("");

  function addSong(song) {
    console.log('Add Song');
    socket.current.emit('addQueue', song);
  }

  function removeSong(index) {
    console.log('Remove Song');
    socket.current.emit('removeQueue', index);
  }

  function addLibrary(song) {
    console.log('Add Library');
    socket.current.emit('addLibrary', song);
  }

  function playSong() {
    console.log('Play Song');
    socket.current.emit('playSong');
  }

  function skipSong() {
    console.log('Skip Song');
    socket.current.emit('skipSong')
  }

  function stopSong() {
    console.log('Stop Song');
    socket.current.emit('stopSong');
  }

  function onSongEnd() {
    console.log('On Song End');
    socket.current.emit('songEnd');
  }

  function editLibrary(song) {
    console.log('Edit Library');
    socket.current.emit('editLibrary', song);
  }

  function deleteSong(song) {
    console.log('Delete Song');
    socket.current.emit('deleteSong', song);
  }

  function speed(direction, pbr) {
    console.log('Speed ' + direction)
    socket.current.emit('speed', direction, pbr);
  }

  function connect(userType, ip) {
    if (!ip) {
      alert("IP address is needed");
      return;
    }
    socket.current = socketClient(ip+':4000');

    socket.current.on("connection", user => {
      role.current = user;
      console.log(role.current);
      console.log(socket.current.id);
      path.current = 'http://'+ip+':4000';
      setPage(user);
    });

    socket.current.on("close", () => {
      flag.current = false;
      socket.current.close();
      console.log("Disconnected from server");
    });

    socket.current.on("connect_error", (error) => {
      socket.current.close();
      alert("Host not available");
      return;
    });

    socket.current.on("connect_timeout", (error) => {
      socket.current.close();
      alert("Host not available");
      return;
    });

    socket.current.on("library", (data) => {
      setLibrary(data);
    })

    socket.current.on("addProgress", (arr) => {
      console.log('addProgress');
      if (arr[0] === 'start') {
        setProgress(arr[1]);
        setShowProgress(true);
      }
      else if(arr[0] === 'end') {
        setProgress("");
        setShowProgress(false);
      }
    });

    socket.current.on("addSuccess", (msg) => {
      console.log('addSuccess');
      setSuccess(msg);
      setShowSuccess(true);
    });

    socket.current.on("addFail", (msg) => {
      console.log('addFail');
      setFailed(msg);
      setShowFailed(true);
    });

    socket.current.on("queue", (data) => {
      setQueue(data);
    });

    socket.current.on("play", (data) => {
      if (data) {
        setPlay(true);
        setStop(false);
        console.log(path.current+"/songs/"+data['code']);
        setSong(path.current+"/songs/"+data['code']);
      }
      else {
        setPlay(false);
      }
    });

    socket.current.on("stop", () => {
      setSong("");
      setStop(true);
      setPlay(false);
    })

    socket.current.on("speed", (direction, pbr) => {
      if (direction === 'up') {
        setPlaybackRate(pbr + .25);
      }
      else if (direction === 'down') {
        setPlaybackRate(pbr - .25);
      }
    })
  }

  useEffect(() => {
    return () => {
      if (flag)
        socket.current.close();
    }
  }, []);

  return (
    <div className="App">
      {page === "home" && <Home connect={connect} />}
      {page === "host" && <Host socket={socket.current} library={library} queue={queue} addSong={addSong} removeSong={removeSong} play={play} skipSong={skipSong} playSong={playSong} stopSong={stopSong} addLibrary={addLibrary} song={song} onSongEnd={onSongEnd} stop={stop} editLibrary={editLibrary} deleteSong={deleteSong} playbackRate={playbackRate} speed={speed} />}
      {page === "user" && <User socket={socket.current} library={library} queue={queue} addSong={addSong} removeSong={removeSong} play={play} skipSong={skipSong} playSong={playSong} stopSong={stopSong} addLibrary={addLibrary} stop={stop} playbackRate={playbackRate} speed={speed} />}
      <div style={{ position: 'absolute', bottom: 0, right: 0 }} >
        <Toast onClose={() => setShowProgress(false)} show={showProgress}>
          <Toast.Header>
            <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
            <strong className="mr-auto">Downloading...</strong>
          </Toast.Header>
          <Toast.Body>{progress}</Toast.Body>
        </Toast>
        <Toast onClose={() => setShowSuccess(false)} show={showSuccess} delay={3000} autohide >
          <Toast.Header>
            <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
            <strong className="mr-auto">Song Addition Success</strong>
          </Toast.Header>
          <Toast.Body>{success}</Toast.Body>
        </Toast>
        <Toast onClose={() => setShowFailed(false)} show={showFailed} delay={3000} autohide >
          <Toast.Header>
            <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
            <strong className="mr-auto">Song Addition Failed</strong>
          </Toast.Header>
          <Toast.Body>{failed}</Toast.Body>
        </Toast>
      </div>
    </div>
  );
}

export default App;
