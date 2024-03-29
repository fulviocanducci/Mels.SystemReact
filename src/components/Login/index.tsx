import Form from "react-bootstrap/Form";
import { Button, FloatingLabel, Image } from "react-bootstrap";
import * as formik from "formik";
import * as Icon from "react-bootstrap-icons";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import FormControlCustom from "../HtmlElements";
import Block from "../Block";
import { validation } from "../../utils";
import { IFormValues } from "../../@types";

import logo from "../../images/logo.png";
import "./styles.css";
import { request } from "../../@requests";

import ButtonLoading from "../ButtonLoading";
import { useState } from "react";
import {
  setLocalStorage,
  useClient,
  useCpf,
  useExpiration,
  useLoginLocalStorage,
  useMargin,
  useToken,
} from "../../@hooks";
import { AxiosError } from "axios";
import Toast from "../Toast";

function Login() {
  const { Formik } = formik;
  const [show, setShow] = useState<boolean>(false);
  const [stateForm, setStateForm] = useState<boolean>(false);
  const { setClient } = useClient();
  const { setToken } = useToken();
  const { cpf: source, setCpf } = useCpf();
  const { setMargin } = useMargin();
  const { setExpiration } = useExpiration();
  const { setLoginStorage, getLoginStorage } = useLoginLocalStorage();
  const navigate = useNavigate();
  const schema = yup.object().shape({
    cpf: yup
      .string()
      .required()
      .test("test-invalid-cpf", "CPF inválido", (cpf) => validation.cpf(cpf)),
  });

  function formikOnSubmit(values: IFormValues) {
    if (values) {
      setStateForm(true);
      request
        .authentication(values.cpf)
        .then(
          (result) => {
            if (result.status === 200) {
              setToken(result.data.token);
              setExpiration(result.data.expiration);
              setClient(result.data.clientRecord);
              setCpf(values.cpf);
              setMargin("65px");
              setLocalStorage(
                values.cpf,
                result.data.token,
                result.data.expiration,
                result.data.clientRecord,
                "65px"
              );
              setLoginStorage(values.cpf);
              navigate("/home");
            }
          },
          (error: AxiosError) => {
            if (error.request.status === 400) {
              setShow(() => true);
            }
          }
        )
        .finally(() => {
          setStateForm(false);
        });
    }
  }

  return (
    <div className="containerFormLogin">
      <Image src={logo} roundedCircle fluid />
      <Formik
        validateOnChange={true}
        validationSchema={schema}
        onSubmit={formikOnSubmit}
        initialValues={{
          cpf: getLoginStorage() ?? "",
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
              <FloatingLabel
                controlId="floatingInput"
                label="CPF"
                className="mb-1"
              >
                <FormControlCustom.Control.Cpf
                  name="cpf"
                  value={values.cpf}
                  onChange={handleChange}
                  isValid={touched.cpf && !errors.cpf}
                  isInvalid={!!errors.cpf}
                ></FormControlCustom.Control.Cpf>
              </FloatingLabel>
              <Block>
                <Button
                  disabled={
                    Array.isArray(errors) ||
                    Object.values(errors).toString() !== ""
                  }
                  variant="success"
                  type="submit"
                  size="sm"
                  className="mt-2 mb-2"
                >
                  {stateForm ? (
                    <>
                      <ButtonLoading /> Entrando ...
                    </>
                  ) : (
                    <>
                      <Icon.DoorClosedFill /> Entrar
                    </>
                  )}
                </Button>
              </Block>
            </Form.Group>
          </Form>
        )}
      </Formik>
      <Toast message="CPF inválido" type="error" show={show} change={setShow} />
    </div>
  );
}

export default Login;
