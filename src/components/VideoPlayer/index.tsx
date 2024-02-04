import { Button, Modal } from "react-bootstrap";
import ReactPlayer from "react-player";
import * as Icon from "react-bootstrap-icons";
import { IVideoPlayer } from "../../@types";
import "./styles.css";
export default function VideoPlayer({ show, setShow, url }: IVideoPlayer) {
  const handleClose = () => setShow(false);
  return (
    <div>
      <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
        <Modal.Body className="text-center">
          {url && (
            <ReactPlayer
              url={url}
              width="100%"
              height="100%"
              playing={true}
              light={true}
              controls
            />
          )}
          <Button
            className="btn btn-dark btn-sm button shadow-sm bg-body-tertiary rounded"
            onClick={handleClose}
          >
            <Icon.XLg className="text-black" />
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
