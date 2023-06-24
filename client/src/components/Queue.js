import React, { useMemo } from 'react';
import $ from 'jquery';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {v4 as uuidv4} from 'uuid';


function Queue(props) {
  // console.log(props.queue);


  let header = (
    <tr className="d-flex" key={"head"}>
      <th className="col" key={'Code'}>Code</th>
      <th className="col" key={'Title'}>Title</th>
      <th className="col" key={'Artist'}>Artist</th>
      <th className="col" key={'Button'}></th>
    </tr>
  );

  // let rows = useMemo(() => {
  //   var data = Object.values(props.queue);
  //   return data.map(function(song, i) {
  //     let time = Date.now();
  //     let key = song.code + time;
  //     return (
  //       <tr className="d-flex" key={"row" + i + key}>
  //         <td className="col" key={key}>{song.code}</td>
  //         <td className="col" key={key + "title"}>{song.title}</td>
  //         <td className="col" key={key + "artist"}>{song.artist}</td>
  //         <td className="col" key={"button"+song.code}><button className="btn btn-outline-dark" key={key} onClick={() => props.removeSong(i)}>Remove from Queue</button></td>
  //       </tr>
  //     );
  //   })
  // }, [props.queue]);

  let rows = useMemo(() => {
    var data = Object.values(props.queue);
    return data.map(function(song, i) {
      let key = song.code + uuidv4();
      return (
        <tr className="d-flex" key={"row" + i + key}>
          <td className="col" key={key}>{song.code}</td>
          <td className="col marquee" id={key + "title"} key={key + "title"} onMouseEnter={(event) => {
            console.log('entered');
            var id = event.target.id;
            var obj = document.getElementById(id);
            console.log(id);
            if (id.substring(id.length - 4, id.length) === "anim") {
              id = id.substring(0, id.length-4);
            }
            if (!obj.style.overflow || obj.style.overflow === "visible") {
              obj.style.overflow = 'hidden';
            }
            if (obj.clientWidth < obj.scrollWidth || obj.clientHeight < obj.scrollHeight) {
              var anim = document.getElementById(event.target.id+'anim');
              if (anim) {
                anim.className = 'anim';
              }
              else {
                console.log("cant find anim");
                console.log(event.target.id);
              }
            }
          }} onAnimationEnd={(event) => {
            console.log('anim end');
            var obj = document.getElementById(event.target.id);
            if (obj) {
              obj.className = '';
            }
          }} ><span id={key + "titleanim"} className=''>{song.title}</span></td>
          <td className="col" key={key + "artist"}>{song.artist}</td>
          <td className="col" key={"button"+song.code}><button className="btn btn-outline-dark" key={key} onClick={() => props.removeSong(i)}>Remove from Queue</button></td>
        </tr>
      );
    })
  }, [props.queue]);

  const table = (
    <table className="table table-hover table-sm">
      <thead>
        {header}
      </thead>
      <tbody className="scroll">
        {rows}
      </tbody>
    </table>
  );

  return (
    <div className="table-fixed">
      {table}
    </div>
  );
}

export default Queue;
