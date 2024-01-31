import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";

import ProtectedRouter from "../ProtectedRouter";

import Home from "../../Pages/Home";
import NoMatch from "../../Pages/NoMatch";
import Login from "../Login";
import Logout from "../../Pages/Logout";
import Payment from "../../Pages/Payment";
import Payments from "../../Pages/Payment/payments";
import UpdateRegistration from "../../Pages/UpdateRegistration";

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

        <Route
          path="/payments"
          element={
            <ProtectedRouter>
              <Payment />
            </ProtectedRouter>
          }
        />
        <Route
          path="/payments/by/:year/all"
          element={
            <ProtectedRouter>
              <Payments />
            </ProtectedRouter>
          }
        />

        <Route
          path="/updateregistration"
          element={
            <ProtectedRouter>
              <UpdateRegistration />
            </ProtectedRouter>
          }
        />
        <Route path="/nomatch" element={<NoMatch />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Container>
  );
}
