import { Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { IButtonGoBack } from "../../@types";

export default function ButtonGoBack({ onClick, className }: IButtonGoBack) {
  return (
    <Button
      size={"sm"}
      variant="success"
      className={className}
      onClick={onClick}
    >
      <Icon.Backspace />
    </Button>
  );
}
