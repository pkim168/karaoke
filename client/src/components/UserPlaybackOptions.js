import React from 'react';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container, ButtonGroup, Button } from 'react-bootstrap';

function UserPlaybackOptions(props) {
  return (
    <ButtonGroup size="lg" className="w-100">
      <Button onClick={props.skipSong}> Skip </Button>
      <Button onClick={() => {
        if (!props.stop) {
          props.stopSong();
        }
      }}> Stop </Button>
      <Button onClick={props.playSong}> Play </Button>
    </ButtonGroup>
  );
}

  export default UserPlaybackOptions
