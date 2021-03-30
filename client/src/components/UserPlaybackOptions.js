import React from 'react';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container, ButtonGroup, Button, InputGroup, FormControl } from 'react-bootstrap';

function UserPlaybackOptions(props) {
  return (
    <>
      <ButtonGroup size="lg" className="w-100">
        <Button onClick={props.skipSong}> Skip </Button>
        <Button onClick={() => {
          if (!props.stop) {
            props.stopSong();
          }
        }}> Stop </Button>
        <Button onClick={props.playSong}> Play </Button>
      </ButtonGroup>
      <InputGroup>
        <InputGroup.Prepend>
          <Button variant="outline-secondary" onClick={() => {
            props.speed('down', props.playbackRate);
          }}> - </Button>
        </InputGroup.Prepend>
        <FormControl
          id="speed"
          placeholder="x1"
          aria-label="Speed"
          aria-describedby="basic-addon1"
          style={{textAlign: "center"}}
          value={"Speed: x"+props.playbackRate}
          disabled
        />
        <InputGroup.Append>
          <Button variant="outline-secondary" onClick={() => {
            props.speed('up', props.playbackRate);
          }}> + </Button>
        </InputGroup.Append>
      </InputGroup>
    </>
  );
}

  export default UserPlaybackOptions
