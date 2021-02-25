import React, {useEffect} from 'react';
import $ from 'jquery';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';
import Queue from './Queue.js';
import Library from './Library.js';
import PlaybackOptions from './PlaybackOptions.js';
import Importer from './Importer.js';

function MainNavbar(props) {

  useEffect(() => {
    $('.dropdown').on({
      "shown.bs.dropdown": function() { this.closable = false; },
      "hide.bs.dropdown":  function(e) {
        if (e.clickEvent) {
          e.preventDefault();
        }
      }
    });
  }, []);

  return (
    <Navbar bg="white" expand="sm" fixed="top" variant="light" className="shadow-sm py-1">
      <Navbar.Toggle aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation" className="navbar-toggler"><span className="navbar-toggler-icon"></span></Navbar.Toggle>
      <Navbar.Collapse id="navbarSupportedContent">
        <Nav className="mr-auto">
          <li className="nav-item">
            <div className="dropdown" >
              <a className="nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Queue </a>
              <div className="dropdown-menu" id="queue" aria-labelledby="dropdownMenuButton">
                <Queue queue={props.queue} removeSong={props.removeSong} />
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="dropdown" >
              <a className="nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Library </a>
              <div className="dropdown-menu" id="library" aria-labelledby="dropdownMenuButton">
                <Library library={props.library} addSong={props.addSong} editLibrary={props.editLibrary} deleteSong={props.deleteSong} />
              </div>
            </div>
          </li>
          <li className="nav-item">
            <div className="dropdown" >
              <a className="nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Playback Options </a>
              <div className="dropdown-menu" id="playback-options" aria-labelledby="dropdownMenuButton">
                <PlaybackOptions skipSong={props.skipSong} stopSong={props.stopSong} playSong={props.playSong} stop={props.stop} />
              </div>
            </div>
          </li>
        </Nav>
        <Nav className="in-line" navbar>
          <li className="nav-item">
            <div className="dropdown" >
              <a className="nav-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> Add to Library </a>
              <div className="dropdown-menu" id="options" aria-labelledby="dropdownMenuButton">
                <Importer addLibrary={props.addLibrary}/>
              </div>
            </div>
          </li>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default MainNavbar;
