import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

import ProtectedRouter from "../ProtectedRouter";

import Home from "../../Pages/Home";
import NoMatch from "../../Pages/NoMatch";
import Login from "../Login";
import Logout from "../../Pages/Logout";

export function RoutesMenu() {
  return (
    <Container fluid style={{ marginTop: "65px" }}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRouter>
              <Home />
            </ProtectedRouter>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRouter>
              <Home />
            </ProtectedRouter>
          }
        />
        <Route path="/login" element={<Login />} />

        <Route
          path="/logout"
          element={
            <ProtectedRouter>
              <Logout />
            </ProtectedRouter>
          }
        />
        {/*
        <Route
          path="/schedule"
          element={
            <ProtectedRouter>
              <Schedule />
            </ProtectedRouter>
          }
        />
        <Route
          path="/patient"
          element={
            <ProtectedRouter>
              <Patient />
            </ProtectedRouter>
          }
        />
        <Route
          path="/schedule/create"
          element={
            <ProtectedRouter>
              <ScheduleCreate />
            </ProtectedRouter>
          }        
        />*/}
        <Route path="/nomatch" element={<NoMatch />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Container>
  );
}
