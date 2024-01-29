import { useLoginStatus } from "../../@hooks";
import Login from "../Login";
import Menu from "../Menu";

function App() {
  const isStatus = useLoginStatus();
  if (isStatus()) {
    return <Menu />;
  }
  return <Login />;
}

export default App;
