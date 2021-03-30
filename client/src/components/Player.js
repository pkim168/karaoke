import React, { useEffect } from 'react';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import ReactPlayer from 'react-player';
import sample from '../assets/Distant_Lights_4K_Motion_Background_Loop.gif';


function Player(props) {

  // If doubling happens, maybe https://stackoverflow.com/questions/41303012/updating-source-url-on-html5-video-with-react

  useEffect(() => {
    console.log(props.song, props.playbackRate);
  }, [props.song, props.playbackRate])


  // <video key={props.song} playsInline="playsinline" autoPlay ended={props.onSongEnd}>
  //   <source src={props.song} type="video/mp4" />
  // </video>


  // <ReactPlayer url={props.song} width={"100%"} height={"100%"} playing={true} onEnded={props.onSongEnd}playsinline/>
  return (
    <>
      <div className="video-background-holder" style={{backgroundImage: `url(${sample})`, backgroundSize:"cover"}}>
        {props.play &&
          <>
            <div className="video-background-overlay"></div>
            <ReactPlayer playbackRate={props.playbackRate} url={props.song} width={"100%"} height={"100%"} playing={true} onEnded={props.onSongEnd} playsinline/>
          </>
        }
      </div>
    </>
  )
}

export default Player;
