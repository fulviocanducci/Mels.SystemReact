import React from "react";
import Form from "react-bootstrap/Form";
import FormControlCustom from "../HtmlElements";
import { Button } from "react-bootstrap";
import Block from "../Block";
import * as formik from "formik";
import * as yup from "yup";
import { validation } from "../../utils";

function Login() {
  const { Formik } = formik;

  const schema = yup.object().shape({
    cpf: yup
      .string()
      .required()
      .test("test-invalid-cpf", "CPF inválido", (cpf) => {
        var st = validation.cpf(cpf);
        console.log(st);
        return st;
      }),
  });
  function formikOnSubmit() {}
  return (
    <Formik
      validationSchema={schema}
      onSubmit={console.log}
      initialValues={{
        cpf: "",
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Email address</Form.Label>
            <FormControlCustom.Control.Cpf name="cpf" value={values.cpf} onChange={handleChange} isValid={touched.cpf && !errors.cpf} isInvalid={!!errors.cpf}></FormControlCustom.Control.Cpf>
            <Form.Control.Feedback type="invalid">111{errors.cpf}</Form.Control.Feedback>
            <Block>
              <Button variant="primary" type="submit" className="mt-2 mb-2">
                Primary
              </Button>
            </Block>
            {values.cpf}
          </Form.Group>
        </Form>
      )}
    </Formik>
  );
}

export default Login;
