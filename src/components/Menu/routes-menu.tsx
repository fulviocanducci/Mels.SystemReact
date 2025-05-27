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
import Training from "../../Pages/Training";
import TrainingDetails from "../../Pages/Training/details";
import { IRouteMenu } from "../../@types";
import Messages from "../../Pages/Messages";
import Assessments from "../../Pages/Assessments";
import CheckIn from "../../Pages/CheckIn";
import CheckInClient from "../../Pages/CheckIn/checkinclient";
import Satisfaction from "../../Pages/Satisfaction";

export function RoutesMenu({ marginTop }: IRouteMenu) {
  return (
    <div
      style={{
        backgroundColor: (marginTop ?? "0") === "0" ? "#CCF4CC" : "#FFFFFF",
      }}
    >
      <Container
        fluid
        style={{
          marginTop: marginTop ?? "0",
        }}
      >
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
            path="/assessments"
            element={
              <ProtectedRouter>
                <Assessments />
              </ProtectedRouter>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRouter>
                <Logout />
              </ProtectedRouter>
            }
          />
          <Route
            path="/checkin"
            element={
              <ProtectedRouter>
                <CheckIn />
              </ProtectedRouter>
            }
          />
          <Route
            path="/checkin/client/:id"
            element={
              <ProtectedRouter>
                <CheckInClient />
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
            path="/training"
            element={
              <ProtectedRouter>
                <Training />
              </ProtectedRouter>
            }
          />
          <Route
            path="/satisfaction"
            element={
              <ProtectedRouter>
                <Satisfaction />
              </ProtectedRouter>
            }
          />
          <Route
            path="/training-details/:dayType/all"
            element={
              <ProtectedRouter>
                <TrainingDetails />
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
          <Route
            path="/messages"
            element={
              <ProtectedRouter>
                <Messages />
              </ProtectedRouter>
            }
          />
          <Route path="/nomatch" element={<NoMatch />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </Container>
    </div>
  );
}
