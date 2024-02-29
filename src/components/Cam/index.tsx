import { Fragment, useState } from "react";
import { Camera } from "./camera";
import { Root, Preview, Footer, GlobalStyle } from "./styles-cam";

export default function Cam() {
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(true);
  const [cardImage, setCardImage] = useState<string | any>();
  return (
    <Fragment>
      <Root>
        {isCameraOpen && <Camera onCapture={(blob: any) => setCardImage(blob)} onClear={() => setCardImage(undefined)} />}

        {cardImage && (
          <div>
            <h2>Preview</h2>
            <Preview src={cardImage && URL.createObjectURL(cardImage)} />
          </div>
        )}

        <Footer>
          <button onClick={() => setIsCameraOpen(true)}>Open Camera</button>
          <button
            onClick={() => {
              setIsCameraOpen(false);
              setCardImage(undefined);
            }}
          >
            Close Camera
          </button>
        </Footer>
      </Root>
      <GlobalStyle />
    </Fragment>
  );
}
