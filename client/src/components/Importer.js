import React from 'react';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, InputGroup, FormControl} from 'react-bootstrap';

function Importer(props) {

  return (
    <Container fluid>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">URL</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          id="url"
          placeholder="YouTube Link Here"
          aria-label="URL"
          aria-describedby="basic-addon1"
          defaultValue=""
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon2">Title</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          id="title"
          placeholder="Title"
          aria-label="Title"
          aria-describedby="basic-addon2"
          defaultValue=""
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon3">Artist</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          id="artist"
          placeholder="Artist"
          aria-label="Artist"
          aria-describedby="basic-addon3"
          defaultValue=""
        />
      </InputGroup>
      {/*<InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon3">Tags</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          id="tags"
          placeholder="Tags"
          aria-label="Tags"
          aria-describedby="basic-addon3"
          value=""
        />
      </InputGroup>*/}
      <InputGroup className="mb-3">
        <Button className="rounded-0" block onClick={() => {
          let url = document.getElementById("url").value;
          let title = document.getElementById("title").value;
          let artist = document.getElementById("artist").value;
          // let tags = document.getElementById("tags").value;

          if (!url || !title || !artist) {
            alert("Fields needed");
            return;
          }

          document.getElementById("url").value = "";
          document.getElementById("title").value = "";
          document.getElementById("artist").value = "";
          // document.getElementById("tags").value = "";
          // props.addLibrary({"url": url, "title": title, "artist": artist, "tags": tags});
          props.addLibrary({"url": url, "title": title, "artist": artist});
          return;
        }}> Add to Library </Button>
      </InputGroup>
    </Container>
  );
}

export default Importer;
