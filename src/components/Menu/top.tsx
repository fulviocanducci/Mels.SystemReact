import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../images/ms-icon-310x310.png";
import { Link } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";

export function Top() {
  const [expanded, setExpanded] = useState<string | undefined | boolean | any>(false);
  const toggle = () => {
    setExpanded(expanded ? false : "lg");
  };
  const setExpandedFalse = () => setExpanded(false);
  return (
    <Navbar bg="success" data-bs-theme="dark" expand="lg" expanded={expanded} fixed="top">
      <Container>
        <Navbar.Brand>
          <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="MELS FITNESS SOFTWARE PRA ACADEMIAS" />{" "}
          MEL FITNESS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggle} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link" onClick={setExpandedFalse}>
              <Icon.WindowDesktop /> Home
            </Link>
            <Link to="/assessments" className="nav-link" onClick={setExpandedFalse}>
              <Icon.PersonExclamation /> Avaliações
            </Link>
            <Link to="/updateregistration" className="nav-link" onClick={setExpandedFalse}>
              <Icon.PencilFill /> Cadastro
            </Link>
            <Link to="/checkin" className="nav-link" onClick={setExpandedFalse}>
              <Icon.CheckCircle /> Check-in
            </Link>
            <Link to="/training" className="nav-link" onClick={setExpandedFalse}>
              <Icon.PersonBoundingBox /> Treinos
            </Link>
            <Link to="/payments" className="nav-link" onClick={setExpandedFalse}>
              <Icon.Coin /> Pagamentos
            </Link>
            <Link to="/messages" className="nav-link" onClick={setExpandedFalse}>
              <Icon.BodyText /> Mensagens
            </Link>
            <Link to="/logout" className="nav-link" onClick={setExpandedFalse}>
              <Icon.DoorClosedFill /> Sair
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
