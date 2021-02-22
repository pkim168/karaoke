import React from 'react';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import UserQueue from './UserQueue.js';
import UserLibrary from './UserLibrary.js';
import UserPlaybackOptions from './UserPlaybackOptions.js';
import Importer from './Importer.js';
import {Navbar, Row, Tab, Col, Nav, InputGroup, FormControl, Button, Container } from 'react-bootstrap';

function User(props) {

  return (
    <div className='flex-column d-flex' style={{maxHeight:"100vh", height:"100vh" }}>
      <Tab.Container defaultActiveKey="library">
        <Row style={{margin:"0"}}>
          <Nav variant="pills" fill justify style={{width: "100%"}}>
            <Nav.Item>
              <Nav.Link className="rounded-0" eventKey="library"> Library </Nav.Link>
            </Nav.Item>
            <div className="w-100"></div>
            <Nav.Item>
              <Nav.Link className="rounded-0" eventKey="queue"> Queue </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="rounded-0" eventKey="playback"> Playback </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="rounded-0" eventKey="add"> Add Song </Nav.Link>
            </Nav.Item>
          </Nav>
        </Row>
        <Row className="flex-grow-1" style={{margin:"0", overflowY:"scroll"}}>
          <Tab.Content className="w-100 h-100">
            <Tab.Pane eventKey="library">
              <UserLibrary library={props.library} addSong={props.addSong} />
            </Tab.Pane>
            <Tab.Pane eventKey="queue">
              <UserQueue queue={props.queue} removeSong={props.removeSong} />
            </Tab.Pane>
            <Tab.Pane className="h-100" eventKey="playback">
              <div style={{paddingTop: "5%"}}>
                <UserPlaybackOptions skipSong={props.skipSong} stopSong={props.stopSong} playSong={props.playSong} stop={props.stop} />
              </div>
            </Tab.Pane>
            <Tab.Pane className="h-100" eventKey="add">
              <div style={{paddingTop: "5%"}}>
                <Importer addLibrary={props.addLibrary}/>
              </div>
            </Tab.Pane>
          </Tab.Content>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default User;
