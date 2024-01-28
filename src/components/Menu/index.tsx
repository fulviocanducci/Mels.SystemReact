import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Top } from "./top";
import { RoutesMenu } from "./routes-menu";

function Menu() {
  return (
    <BrowserRouter>
      <Top />
      <RoutesMenu />
    </BrowserRouter>
  );
}

export default Menu;
