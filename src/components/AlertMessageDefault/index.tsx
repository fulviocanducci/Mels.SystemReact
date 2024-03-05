import { Alert } from "react-bootstrap";

type AlertMessageDefaultType = {
  title: string;
  body: string;
};

export default function AlertMessageDefault({ title, body }: AlertMessageDefaultType) {
  return (
    <Alert key={"success"} variant={"success"} className="text-success">
      <Alert.Heading>
        <b>{title}</b>
      </Alert.Heading>
      {body}
    </Alert>
  );
}
