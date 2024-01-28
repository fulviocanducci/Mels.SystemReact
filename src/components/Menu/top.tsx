import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";

export function Top() {
  const [expanded, setExpanded] = useState<string | undefined | boolean | any>(false);
  const toggle = () => {
    setExpanded(expanded ? false : "lg");
  };
  const setExpandedFalse = () => setExpanded(false);
  return (
    <Navbar bg="success" data-bs-theme="dark" expand="lg" expanded={expanded} fixed="top">
      <Container>
        <Navbar.Brand href="#home">
          <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="Mels Fitness Academias" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggle} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link" onClick={setExpandedFalse}>
              Home
            </Link>
            <Link to="/nomatch" className="nav-link" onClick={setExpandedFalse}>
              Home
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
