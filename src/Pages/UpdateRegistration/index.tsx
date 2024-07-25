import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AsyncSelect from "react-select/async";

import * as formik from "formik";
import * as yup from "yup";
import * as Icon from "react-bootstrap-icons";

import { formats, validation } from "../../utils";
import Block from "../../components/Block";
import FormControlCustom from "../../components/HtmlElements";
import { setClientLocalStorage, useClient } from "../../@hooks";
import { request } from "../../@requests";
import { ClientRecord, ISelect2 } from "../../@types";
import Title from "../../components/Title";
import Toast from "../../components/Toast";
import { useCallback, useEffect, useRef, useState } from "react";
import ButtonLoading from "../../components/ButtonLoading";
import Loading from "../../components/Loading";
import { Tab, Tabs } from "react-bootstrap";
import { Img } from "react-image";
import uniqid from "uniqid";
import Webcam from "react-webcam";
import { AxiosError } from "axios";
import Cam from "../../components/Cam";
function messageSaveSuccess(): { message: string; type: "success" | "error" } {
  return {
    message: "Dados alterados com êxito",
    type: "success",
  };
}
function messageSaveError(): { message: string; type: "success" | "error" } {
  return {
    message: "Dados não foram alterados",
    type: "error",
  };
}
function messagePhotoSuccess(): { message: string; type: "success" | "error" } {
  return {
    message: "Foto alterado com êxito",
    type: "success",
  };
}
function messagePhotoError(): { message: string; type: "success" | "error" } {
  return {
    message: "Foto inválida, tente novamente",
    type: "error",
  };
}
function messagePhotoErrorNetwork(): { message: string; type: "success" | "error" } {
  return {
    message: "Error de rede ou internet, mande novamente",
    type: "error",
  };
}
const fileTypes = [
  "image/jpeg",
  // "image/apng",
  // "image/bmp",
  // "image/gif",
  // "image/pjpeg",
  // "image/png",
  // "image/svg+xml",
  // "image/tiff",
  // "image/webp",
  // "image/x-icon",
];
export default function UpdateRegistration() {
  const [tab, setTab] = useState<string | null | undefined>("home");
  const [showCam, setShowCam] = useState<boolean>(false);
  const { client, setClient } = useClient();
  const [photos, setPhotos] = useState<string[] | undefined | null>(null);
  const [stateForm, setStateForm] = useState<boolean>(false);
  const [optionsSelect2, setOptionsSelect2] = useState<ISelect2>({
    value: 1,
    label: "",
  });
  const formClientPhotoRef = useRef<HTMLFormElement | undefined | any>(null);
  const { Formik } = formik;
  const [show, setShow] = useState<boolean>(false);
  const [showMessageData, setMessageData] = useState<{ message: string; type: "success" | "error" }>(() => messageSaveSuccess());
  const [photo, setPhoto] = useState(null);
  const webCamRef = useRef<React.LegacyRef<Webcam> | undefined | any>(null);
  const capturePhoto = useCallback(() => {
    if (webCamRef && webCamRef.current) {
      const imageSrc = webCamRef?.current?.getScreenshot({ width: 600, height: 600 });
      setPhoto(imageSrc);
    }
  }, [webCamRef]);

  const schema = yup.object().shape({
    cpf: yup
      .string()
      .required()
      .test("test-invalid-cpf", "CPF inválido", (cpf) => validation.cpf(cpf)),
    name: yup.string().required().max(64),
    sex: yup.number().required(),
    dateBirthday: yup.string().test("test-invalid-date", "Data inválida", (dateBirthday) => {
      return validation.dateOrEmpty(dateBirthday);
    }),
    email: yup.string().email().max(40),
    address: yup.string().max(50),
    cityId: yup.number(),
    phoneOne: yup.string().max(14),
    phoneTwo: yup.string().max(14),
    addressNumber: yup.string().required().max(10),
    district: yup.string().required().max(30),
  });

  function setOptionsSelect2Handle(e: any, callBack: any) {
    setOptionsSelect2({ ...e });
    callBack("cityId", e.value);
  }

  function loadOptionsCitySelect2(inputValue: string, callback: (options: ISelect2[]) => void) {
    request.citySelect2(inputValue).then((result) => {
      callback(result);
    });
  }

  function formikOnSubmit(values: ClientRecord | null | undefined | any) {
    if (values) {
      setStateForm(true);
      const data = formats.client(values) as ClientRecord;
      if (data) {
        request
          .clientUpdate(data)
          .then(
            (result) => {
              if (result.status === 200) {
                const clientRecord: ClientRecord = result.data;
                if (clientRecord !== null) {
                  setClient(clientRecord);
                  setClientLocalStorage(clientRecord);
                  setMessageData(() => messageSaveSuccess());
                  setShow(() => true);
                }
              }
            },
            (error) => {
              setMessageData(() => messageSaveError());
              setShow(() => true);
            }
          )
          .finally(() => {
            setStateForm(false);
          });
      }
    }
  }

  function initPhotosOrUpdate(cpf: string | null): string[] {
    return [
      `https://www.mels.com.br/Down/clientes/${cpf}.jpg?id=${uniqid()}`,
      `https://www.mels.com.br/Down/clientes/photo-default.jpg?id=${uniqid()}`,
    ];
  }

  function sendCpfPhoto(formData: FormData) {
    const cpfValid = formData.get("cpf");
    const photoValid = formData.get("photo") as any;
    if (cpfValid && photoValid.name && photoValid.name.length > 0 && fileTypes.includes(photoValid.type)) {
      setStateForm(true);
      request
        .clientPhotoSend(formData)
        .then(
          (result) => {
            if (result.status === 200) {
              if (client) {
                setPhotos(initPhotosOrUpdate(client?.cpf));
                setMessageData(() => messagePhotoSuccess());
                setShow(() => true);
                if (formClientPhotoRef?.current !== null) {
                  formClientPhotoRef?.current.reset();
                }
              }
            }
          },
          (error: AxiosError) => {
            console.log(error);
            if (client && client?.cpf) {
              setPhotos(initPhotosOrUpdate(client?.cpf));
            }
            if (error.code === "ERR_NETWORK") {
              setMessageData(() => messagePhotoErrorNetwork());
            } else {
              setMessageData(() => messagePhotoError());
            }
            setShow(() => true);
          }
        )
        .finally(() => {
          setStateForm(false);
        });
    } else {
      setMessageData(() => messagePhotoError());
      setShow(() => true);
      setStateForm(false);
    }
  }
  function onSubmitPhoto(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as any);
    sendCpfPhoto(formData);
  }

  function handleSendPhoto() {
    if (client) {
      const formData = new FormData();
      formData.append("cpf", client?.cpf);
      formData.append("photo", formats.dataURIToBlob(photo), `${client?.cpf}.jpg`);
      sendCpfPhoto(formData);
    }
  }

  useEffect(() => {
    if (client && client.cityRecord && client.cityRecord.id && client.cityRecord.name && client.cityRecord.uf) {
      const data = {
        value: client.cityRecord.id,
        label: client.cityRecord.name + " - " + client.cityRecord.uf,
      };
      setOptionsSelect2(data);
      setPhotos(initPhotosOrUpdate(client.cpf));
    }
  }, [client]);

  useEffect(() => {
    if (tab) {
      switch (tab) {
        case "home": {
          setShowCam(() => false);
          break;
        }
        case "photo": {
          setShowCam(() => false);
          break;
        }
        case "cam": {
          setShowCam(() => true);
          break;
        }
        default: {
          setShowCam(() => false);
        }
      }
    }
  }, [tab]);

  if (!client) {
    return <Loading />;
  }

  return (
    <div className="mb-5">
      <Title description="Dados cadastrais" />
      <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" onSelect={(tab) => setTab(tab)} className="mb-3" fill>
        <Tab eventKey="home" title="Dados">
          <Formik
            validateOnChange={true}
            validationSchema={schema}
            onSubmit={formikOnSubmit}
            initialValues={{
              cpf: client?.cpf,
              name: client?.name,
              sex: client?.sex,
              dateBirthday: formats.date(client?.dateBirthday),
              email: client?.email,
              address: client?.address,
              cityId: client?.cityId,
              cityRecord: client?.cityRecord,
              phoneOne: client?.phoneOne,
              phoneTwo: client?.phoneTwo,
              academyId: client?.academyId,
              academyDocument: client?.academyDocument,
              addressNumber: client?.addressNumber,
              district: client?.district,
            }}
          >
            {({ handleSubmit, handleChange, values, touched, errors, setFieldValue }) => (
              <>
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-2" controlId="exampleForm.name">
                    <Form.Label className="mb-0">Nome completo:</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      isValid={touched.name && !errors.name}
                      isInvalid={!!errors.name}
                      placeholder="Nome completo"
                      maxLength={64}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="exampleForm.sex">
                    <Form.Label className="mb-0">Sexo:</Form.Label>
                    <Form.Select
                      name="sex"
                      className="mb-2"
                      value={values.sex}
                      onChange={handleChange}
                      isValid={touched.sex && !errors.sex}
                      isInvalid={!!errors.sex}
                      aria-label="Floating label select example"
                    >
                      <option value="1">Masculino</option>
                      <option value="2">Feminino</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="exampleForm.date">
                    <Form.Label className="mb-0">Data de nascimento:</Form.Label>
                    <FormControlCustom.Control.Date
                      name="dateBirthday"
                      value={values.dateBirthday ?? ""}
                      onChange={handleChange}
                      isValid={touched.dateBirthday && !errors.dateBirthday}
                      isInvalid={!!errors.dateBirthday}
                      placeholder="Data de nascimento"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="exampleForm.cityId">
                    <Form.Label className="mb-0">Cidade / Uf:</Form.Label>
                    <AsyncSelect
                      noOptionsMessage={() => "Digite o nome da cidade"}
                      styles={{
                        container: (provider, state) => ({
                          ...provider,
                          borderColor: errors.cityId ? "#66afe9" : "#66afe9",
                        }),
                      }}
                      cacheOptions
                      loadOptions={loadOptionsCitySelect2}
                      defaultOptions={false}
                      value={optionsSelect2}
                      onChange={(e) => setOptionsSelect2Handle(e, setFieldValue)}
                      name="cityId"
                      id="cityId"
                      placeholder="Digite o nome da cidade"
                      isSearchable={true}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="exampleForm.email">
                    <Form.Label className="mb-0">E-mail:</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      isValid={touched.email && !errors.email}
                      isInvalid={!!errors.email}
                      placeholder="E-mail"
                      maxLength={40}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="exampleForm.address">
                    <Form.Label className="mb-0">Endereço:</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      isValid={touched.address && !errors.address}
                      isInvalid={!!errors.address}
                      placeholder="Endereço completo"
                      maxLength={50}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="exampleForm.addressNumber">
                    <Form.Label className="mb-0">Número:</Form.Label>
                    <Form.Control
                      type="text"
                      name="addressNumber"
                      value={values.addressNumber}
                      onChange={handleChange}
                      isValid={touched.addressNumber && !errors.addressNumber}
                      isInvalid={!!errors.addressNumber}
                      placeholder="Endereço número"
                      maxLength={10}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="exampleForm.district">
                    <Form.Label className="mb-0">Bairro:</Form.Label>
                    <Form.Control
                      type="text"
                      name="district"
                      value={values.district}
                      onChange={handleChange}
                      isValid={touched.district && !errors.district}
                      isInvalid={!!errors.district}
                      placeholder="Bairro"
                      maxLength={30}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="exampleForm.phoneOne">
                    <Form.Label className="mb-0">Telefone 1:</Form.Label>
                    <FormControlCustom.Control.Phone
                      name="phoneOne"
                      value={values.phoneOne ?? ""}
                      onChange={handleChange}
                      isValid={touched.phoneOne && !errors.phoneOne}
                      isInvalid={!!errors.phoneOne}
                      placeholder="Telefone"
                    />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="exampleForm.phoneTwo">
                    <Form.Label className="mb-0">Telefone 2:</Form.Label>
                    <FormControlCustom.Control.Phone
                      name="phoneTwo"
                      value={values.phoneTwo ?? ""}
                      onChange={handleChange}
                      isValid={touched.phoneTwo && !errors.phoneTwo}
                      isInvalid={!!errors.phoneTwo}
                      placeholder="Celular"
                    />
                  </Form.Group>
                  <Block>
                    <Button
                      disabled={Array.isArray(errors) || Object.values(errors).toString() !== ""}
                      variant="success"
                      type="submit"
                      size="sm"
                      className="mt-2 mb-2"
                    >
                      {stateForm ? (
                        <>
                          <ButtonLoading /> Atualizando ...
                        </>
                      ) : (
                        <>
                          <Icon.Pencil /> Atualizar
                        </>
                      )}
                    </Button>
                  </Block>
                </Form>
                {/* <pre>{JSON.stringify(values)}</pre> */}
              </>
            )}
          </Formik>
        </Tab>
        <Tab eventKey="photo" title="Foto">
          {client && client.cpf && photos && (
            <>
              <div>
                <Form onSubmit={onSubmitPhoto} ref={formClientPhotoRef}>
                  <input type="hidden" name="cpf" id="cpf" value={client?.cpf} />
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label className="text-success">Escolha a sua Foto (somente jpg)</Form.Label>
                    <Form.Control type="file" name="photo" accept="image/jpeg" />
                    <div className="d-grid gap-2 mt-2 mb-2">
                      <Button variant="success" size="sm" type="submit">
                        {stateForm ? (
                          <>
                            <ButtonLoading /> Enviando ...
                          </>
                        ) : (
                          <>
                            <Icon.Send /> Enviar
                          </>
                        )}
                      </Button>
                    </div>
                  </Form.Group>
                </Form>
              </div>
              <div>
                <Form.Label className="text-success text-start">Foto atual</Form.Label>
              </div>
              <div className="text-start" style={{ overflowX: "scroll" }}>
                <div>
                  <Img className="rounded" src={photos} />
                </div>
              </div>
            </>
          )}
        </Tab>
        <Tab eventKey="cam" title="Camera">
          <div>
            {photo && (
              <div>
                <Form.Label className="mb-1 text-success">Foto</Form.Label>
              </div>
            )}
            {showCam && (
              <>
                <div className="text-start" style={{ overflowX: "scroll" }}>
                  {photo && (
                    <div>
                      <img src={photo} alt="" title="" className="img-fluid" />
                      <div className="mt-2 mb-2 d-flex justify-content-between">
                        <Button variant="success" size="sm" onClick={handleSendPhoto} className="m-1" style={{ width: "48%" }}>
                          {stateForm ? (
                            <>
                              <ButtonLoading /> Salvando ...
                            </>
                          ) : (
                            <>
                              <Icon.Save /> Salvar
                            </>
                          )}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => setPhoto(null)}
                          className="m-1"
                          style={{ width: "48%" }}
                        >
                          <Icon.Trash3 /> Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                {!photo && (
                  <>
                    <div>
                      <Form.Label className="mb-1">Tire sua Foto</Form.Label>
                    </div>
                    <div className="text-start text-success" style={{ overflowX: "scroll" }}>
                      <Webcam
                        ref={webCamRef}
                        screenshotFormat="image/jpeg"
                        imageSmoothing={true}
                        audio={false}
                        width={"100%"}
                        height={"100%"}
                        minScreenshotHeight={600}
                        minScreenshotWidth={600}
                      />
                      <div className="d-grid gap-2 mt-0 mb-2">
                        <Button variant="success" size="sm" onClick={capturePhoto}>
                          <Icon.Camera /> Foto
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Tab>
      </Tabs>
      <Toast message={showMessageData.message} type={showMessageData.type} show={show} change={setShow} />
    </div>
  );
}
