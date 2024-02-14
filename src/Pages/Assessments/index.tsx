import { useEffect, useState } from "react";
import { useCpf } from "../../@hooks";
import Title from "../../components/Title";
import { IAssessment } from "../../@types";
import Loading from "../../components/Loading";
import { request } from "../../@requests";
import { isErrorToRedirect } from "../../utils/error";
import AlertMessageDefault from "../../components/AlertMessageDefault";
import { Alert, Button, Modal } from "react-bootstrap";
import { formats, getShowPdf } from "../../utils";
import * as Icon from "react-bootstrap-icons";
import PDFView from "../../components/PDFView";
import "./styles.css";
export default function Assessments() {
  const { cpf } = useCpf();
  const [show, setShow] = useState<boolean>(false);
  const [file, setFile] = useState<string | null>(null);
  const [items, setItems] = useState<Array<IAssessment> | null>(null);

  const handleFileAndShowModal = (file: string | null) => {
    setFile(() => file);
    setShow(() => true);
  };

  const handleModalHide = () => {
    setFile(() => null);
    setShow(() => false);
  };

  useEffect(() => {
    if (cpf) {
      request.assessmentGetAll(cpf).then((result) => {
        if (result.status === 200) {
          setItems(result.data);
        }
      }, isErrorToRedirect);
    }
  }, [cpf]);

  if (items === null) {
    return <Loading />;
  }

  return (
    <>
      <div>
        <Title description={"Avaliações"}></Title>
        {items && items.length === 0 && (
          <div>
            <AlertMessageDefault title={"Sem Avalições"} body={"Não foi encontrado nenhum avaliação"} />
          </div>
        )}
        {items &&
          items.length > 0 &&
          items.map((data, index) => (
            <div className="col-md-6" key={index}>
              <Alert key={index} variant={"success"}>
                {/* <Alert.Heading className="mb-0 text-success">Avaliação</Alert.Heading> */}
                <p className="mt-0 mb-0">
                  <small className="text-success">
                    <b>Data de avaliação:</b> {formats.date(data.dateAssessment)}
                  </small>
                </p>
                <hr className="mt-0 mb-2" />
                <div className="d-flex justify-content-between">
                  <Button
                    className="w-49"
                    variant="success"
                    size="sm"
                    onClick={() => handleFileAndShowModal(getShowPdf(data.fileName))}
                  >
                    <Icon.FileEarmarkPdfFill /> Abrir
                  </Button>
                  <Button
                    target="_blank"
                    className="w-49"
                    href={getShowPdf(data.fileName)}
                    as="a"
                    variant="success"
                    size="sm"
                    onClick={() => null}
                  >
                    <Icon.FilePdf /> Visualizar
                  </Button>
                </div>
              </Alert>
            </div>
          ))}
      </div>
      {file && (
        <Modal show={show} fullscreen={true} onHide={handleModalHide}>
          <Modal.Header closeButton>
            <Modal.Title>Avaliação</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <PDFView file={file} />
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
