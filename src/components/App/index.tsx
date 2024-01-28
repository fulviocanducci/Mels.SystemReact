import React from "react";
import Login from "../Login";
import Menu from "../Menu";

function App() {
  const status = false;
  if (status) {
    return <Login />;
  }
  return <Menu />;
}

export default App;
