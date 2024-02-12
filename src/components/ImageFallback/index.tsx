import ReactImageFallback from "react-image-fallback";
import { useClient } from "../../@hooks";
import { getImageLogoAcademy } from "../../utils";
import logo from "../../images/logo-l.png";
import { Spinner } from "react-bootstrap";

export default function ImageFallback() {
  const { client } = useClient();

  if (client === null) {
    return <></>;
  }

  return (
    <ReactImageFallback
      src={getImageLogoAcademy(client?.academyDocument)}
      fallbackImage={logo}
      initialImage={<Spinner animation="grow" />}
      alt="Academia Logo"
      className="img-fluid rounded-circle mx-auto d-block shadow"
    />
  );
}
