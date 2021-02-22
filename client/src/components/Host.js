import React from 'react';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import MainNavbar from './MainNavbar.js';
import Player from './Player.js';

function Host(props) {

  return (
    <>
      <MainNavbar queue={props.queue} library={props.library} addSong={props.addSong} removeSong={props.removeSong} skipSong={props.skipSong} playSong={props.playSong} stopSong={props.stopSong} addLibrary={props.addLibrary} stop={props.stop} />
      <Player song={props.song} play={props.play} onSongEnd={props.onSongEnd}/>
    </>
  );
}

export default Host;
