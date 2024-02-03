import { Button, Modal } from "react-bootstrap";
import ReactPlayer from "react-player";
import * as Icon from "react-bootstrap-icons";
import { IVideoPlayer } from "../../@types";
import "./styles.css";
export default function VideoPlayer({ show, setShow, url }: IVideoPlayer) {
  return (
    <div>
      <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Body>
          {url && (
            <ReactPlayer
              url={url}
              width="100%"
              height="100%"
              playing={true}
              controls
            />
          )}
          <Button
            className="btn btn-light btn-circle button"
            onClick={() => setShow(false)}
          >
            {" "}
            <Icon.XLg />
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
