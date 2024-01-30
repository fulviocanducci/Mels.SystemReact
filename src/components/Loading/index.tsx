import { Spinner } from "react-bootstrap";
import "./styles.css";
export default function Loading() {
  return (
    <div className="containerLoading">
      <Spinner animation="grow" variant="success" />
    </div>
  );
}
