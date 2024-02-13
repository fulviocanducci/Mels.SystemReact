import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";

export default function PDFView({ path }: { path: string }) {
  const [file, setFile] = useState<string | null>();
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  useEffect(() => {
    setFile(path);
    return () => {
      setFile(null);
    };
  }, [path]);

  if (file) {
    return (
      <div>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        <div>
          Página: {pageNumber} de {numPages}
        </div>
      </div>
    );
  }
  return <></>;
}
