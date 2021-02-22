import React from 'react';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

function PlaybackOptions(props) {
  return (
    <>
      <a className="dropdown-item" onClick={props.skipSong}> Skip </a>
      <a className="dropdown-item" onClick={() => {
        if (!props.stop) {
          props.stopSong();
        }
      }}> Stop </a>
      <a className="dropdown-item" onClick={props.playSong}> Play </a>
    </>
  );
}

  export default PlaybackOptions
