import { pdfjs } from "react-pdf";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Alert } from "react-bootstrap";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.js", import.meta.url).toString();

export default function PDFView({ file }: { file: string | null }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const alertError = () => {
    return (
      <Alert key={"danger"} variant={"danger"}>
        Erro no carregamento !!!
      </Alert>
    );
  };

  if (file === null) {
    return <></>;
  }

  return (
    <div>
      <Viewer renderError={alertError} fileUrl={file} plugins={[defaultLayoutPluginInstance]} />
    </div>
  );
}
