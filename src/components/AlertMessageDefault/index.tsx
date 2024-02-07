import { Alert } from "react-bootstrap";

type AlertMessageDefaultType = {
  title: string;
  body: string;
};

export default function AlertMessageDefault({ title, body }: AlertMessageDefaultType) {
  return (
    <Alert key={"success"} variant={"light"} className="border border-success text-success">
      <Alert.Heading>{title}</Alert.Heading>
      {body}
    </Alert>
  );
}
