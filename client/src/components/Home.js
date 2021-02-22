import React from 'react';
import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Button, Tab, Nav, InputGroup, FormControl} from 'react-bootstrap';

function Home(props) {

  return (
    <div id="connectPrompt" className="align-items-center justify-content-center text-center" style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
      <Row>
        <h2 className="align-items-center" style={{padding: "0"}}> Connect as Host or User? </h2>
      </Row>
      <Row>
        <Tab.Container defaultActiveKey="host">
          <Col id="connectTabContainer">
            <Row>
              <Nav variant="pills" fill style={{width: "100%"}}>
                <Nav.Item>
                  <Nav.Link className="rounded-0" eventKey="host"> Host </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="rounded-0" eventKey="user"> User </Nav.Link>
                </Nav.Item>
              </Nav>
            </Row>
            <Row style={{padding: "15px 0px"}}>
              <Tab.Content style={{ width:"100%"}}>
                <Tab.Pane eventKey="host">
                  <Button className="rounded-0" block onClick={() => {
                    props.connect("host", "localhost");
                  }}> Create Room </Button>
                </Tab.Pane>
                <Tab.Pane eventKey="user">
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1">Host IP</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      id="hostIP"
                      placeholder="192.168.1.1"
                      aria-label="Host IP"
                      aria-describedby="basic-addon1"
                    />
                    <Button className="rounded-0" block onClick={() => {
                      let hostIP = document.getElementById("hostIP").value;
                      props.connect("user", hostIP)
                    }}> Connect </Button>
                  </InputGroup>
                </Tab.Pane>
              </Tab.Content>
            </Row>
          </Col>
        </Tab.Container>
      </Row>
    </div>
  );
}

export default Home;
