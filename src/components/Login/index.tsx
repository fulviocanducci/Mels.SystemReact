import Form from "react-bootstrap/Form";
import { Button, FloatingLabel, Image } from "react-bootstrap";
import * as formik from "formik";
import * as Icon from "react-bootstrap-icons";
import * as yup from "yup";

import FormControlCustom from "../HtmlElements";
import Block from "../Block";
import { validation } from "../../utils";
import { IFormValues } from "../../@types";

import logo from "../../images/logo.png";
import "./styles.css";
import { request } from "../../@requests";
import {
  useSetClient,
  useSetCpf,
  useSetExpiration,
  useSetToken,
} from "../../@hooks";

function Login() {
  //const navigate = useNavigate();
  const { Formik } = formik;
  const { setClientStorage } = useSetClient();
  const { setTokenStorage } = useSetToken();
  const { setCpfStorage } = useSetCpf();
  const { setExpirationStorage } = useSetExpiration();
  const schema = yup.object().shape({
    cpf: yup
      .string()
      .required()
      .test("test-invalid-cpf", "CPF inválido", (cpf) => validation.cpf(cpf)),
  });

  function formikOnSubmit(values: IFormValues) {
    if (values) {
      request.authentication(values.cpf).then(
        (result) => {
          if (result.status === 200) {
            setTokenStorage(result.data.token);
            setExpirationStorage(result.data.expiration);
            setClientStorage(result.data.clientRecord);
            setCpfStorage(values.cpf);
          }
        },
        (error) => console.log(error)
      );
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
          cpf: "",
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
                  className="mt-2 mb-2"
                >
                  {Array.isArray(errors) ||
                  Object.values(errors).toString() !== "" ? (
                    <Icon.DoorClosed />
                  ) : (
                    <Icon.DoorOpen />
                  )}{" "}
                  Entrar
                </Button>
              </Block>
            </Form.Group>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
