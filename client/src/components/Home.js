import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import background from './background.png'
import { Button } from "react-bootstrap";
const Home = () => (
  <div>
    <section id="welcome_box" className="bg-light" style={{ backgroundImage:`url(${background})` }}>
    <Container fluid>
    <Row>
    <Col>
    <div id="h1_id" className="col-lg-6 order-2 order-lg-1" >
      <h1>Welcome to LintRollers</h1>
      <p className="lead">Assisting you throughout your travels</p>
      {/* <p><a href="#" className="btn btn-primary shadow mr-2">Discover More</a></p> */}
    </div>
    </Col>
    <Col>
    {/* <div id="h1_id" style={{display: 'flex', justifyContent: 'center'}}>
      <Button size="lg" >Start my journal</Button>
      </div> */}
    </Col>
    </Row>
    </Container>
    </section>
    <Container fluid>
  <Row className="p-2">
    <Col>
    <img id="img_one" className="d-block w-100" height="500px" src="/images/home_map.jpg" alt="test"></img>
    </Col>
    <Col>
    <img id="img_two" className="d-block w-100" height="500px" src="/images/test_1.jpg" alt="test"></img>
    </Col>
  </Row>
  <Row className="p-2">
    <Col>
    <img id="img_three" className="d-block w-100" height="500px" src="/images/test_2.jpg" alt="test"></img>
    </Col>
    <Col>
    <img id="img_four" className="d-block w-100" height="500px" src="/images/test_3.jpg" alt="test"></img>
    </Col>
  </Row>
  </Container>
  </div>

);

export default Home;