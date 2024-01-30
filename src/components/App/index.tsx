import Menu from "../Menu";
import Login from "../Login";
import { useLoginStatusState } from "../../@hooks";

function App() {
  const isStatus = useLoginStatusState();
  if (isStatus()){
    return <Menu />;
  }
  return <Login />;
}

export default App;
