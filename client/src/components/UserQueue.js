import React, { useMemo } from 'react';
import $ from 'jquery';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


function UserQueue(props) {
  // console.log(props.queue);
  const uuidv4 = require("uuid/v4");

  let header = (
    <tr className="d-flex" key={"head"}>
      <th className="col-4" key={'Title'}>Title</th>
      <th className="col-4" key={'Artist'}>Artist</th>
      <th className="col-4" key={'Button'}></th>
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
          <td className="col-4 marquee" id={key + "title"} key={key + "title"} onPointerEnter={(event) => {
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
          <td className="col-4" key={key + "artist"}>{song.artist}</td>
          <td className="col-4" key={"button"+song.code} style={{textAlign: "center"}}><button className="btn btn-outline-dark" style={{width: "100%"}} key={key} onClick={() => props.removeSong(i)}>Remove</button></td>
        </tr>
      );
    })
  }, [props.queue]);

  const table = (
    <table style={{width: "100%", maxWidth:"100%", tableLayout:"fixed", maxHeight:"100%"}}>
      <thead>
        {header}
      </thead>
      <tbody className="scroll">
        {rows}
      </tbody>
    </table>
  );

  return (
    <>
      {table}
    </>
  );
}

export default UserQueue;
