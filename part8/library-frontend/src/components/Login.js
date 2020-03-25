import React from "react";
import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import Notifications from "./Notifications";
import LoginForm from "./LoginForm";

const Login = () => {
  return (
    <>
      <Helmet>
        <title>GraphQL Library | Login</title>
      </Helmet>

      <Notifications />

      <Container className="min-vw-100 bg-dark">
        <Row className="vh-100 align-items-center justify-content-center">
          <Col xs={12} sm={7} md={6} lg={4}>
            <Card>
              <Card.Header>
                <h1 className="h3">Login</h1>
              </Card.Header>
              <Card.Body>
                <LoginForm />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
