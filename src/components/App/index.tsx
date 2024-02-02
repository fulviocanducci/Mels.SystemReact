import Menu from "../Menu";
import Login from "../Login";
import { useLoginStatus } from "../../@hooks";

function App() {
  const { isStatus } = useLoginStatus();
  if (isStatus()) {
    return <Menu />;
  }
  return <Login />;
}

export default App;
