import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";

import * as formik from "formik";
import * as Icon from "react-bootstrap-icons";
import * as yup from "yup";

import { formats, validation } from "../../utils";
import Block from "../../components/Block";
import FormControlCustom from "../../components/HtmlElements";
import { useGetClient, useSetClient } from "../../@hooks";
import { request } from "../../@requests";
import { ClientRecord } from "../../@types";
import Title from "../../components/Title";
import Toast from "../../components/Toast";
import { useState } from "react";

export default function UpdateRegistration() {
  const client = useGetClient();
  const { setClientStorage } = useSetClient();
  const { Formik } = formik;
  const [show, setShow] = useState<boolean>(false);

  const schema = yup.object().shape({
    cpf: yup
      .string()
      .required()
      .test("test-invalid-cpf", "CPF inválido", (cpf) => validation.cpf(cpf)),
    name: yup.string().required(),
    sex: yup.number().required(),
    dateBirthday: yup
      .string()
      .test("test-invalid-date", "Data inválida", (dateBirthday) =>
        validation.dateOrEmpty(dateBirthday)
      ),
    email: yup.string().email(),
    address: yup.string(),
    cityId: yup.number(),
    phoneOne: yup.string(),
    phoneTwo: yup.string(),
  });

  function formikOnSubmit(values: ClientRecord | null | undefined | any) {
    if (values) {
      const data = formats.client(values) as ClientRecord;
      if (data) {
        request.clientUpdate(data).then((result) => {
          if (result.status === 200) {
            const clientRecord: ClientRecord = result.data;
            if (clientRecord !== null) {
              setClientStorage(clientRecord);
              setShow(() => true);
            }
          }
        });
      }
    }
  }

  return (
    <div>
      <Title description="Dados cadastrais" />
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
          phoneOne: client?.phoneOne,
          phoneTwo: client?.phoneTwo,
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <>
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group
                className="mb-1"
                controlId="exampleForm.ControlInput1"
              >
                <FloatingLabel
                  controlId="floatingInput"
                  label="Nome Completo"
                  className="mb-1"
                >
                  <Form.Control
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    isValid={touched.name && !errors.name}
                    isInvalid={!!errors.name}
                  />
                </FloatingLabel>
                <Form.Label>Escolha o sexo</Form.Label>
                <div className="d-flex justify-content-around mt-1 mb-3">
                  <Form.Check
                    inline
                    label="Masculino"
                    name="sex"
                    type={"radio"}
                    value="1"
                    id={`inline-${"radio"}-1`}
                    onChange={handleChange}
                    checked={values.sex == 1}
                  />
                  <Form.Check
                    inline
                    label="Feminino"
                    name="sex"
                    type={"radio"}
                    value="2"
                    id={`inline-${"radio"}-2`}
                    onChange={handleChange}
                    checked={values.sex == 2}
                  />
                </div>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Data de nascimento"
                  className="mb-1"
                >
                  <FormControlCustom.Control.Date
                    name="dateBirthday"
                    value={values.dateBirthday ?? ""}
                    onChange={handleChange}
                    isValid={touched.dateBirthday && !errors.dateBirthday}
                    isInvalid={!!errors.dateBirthday}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingInput"
                  label="E-mail"
                  className="mb-1"
                >
                  <Form.Control
                    type="text"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isValid={touched.email && !errors.email}
                    isInvalid={!!errors.email}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Endereço"
                  className="mb-1"
                >
                  <Form.Control
                    type="text"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    isValid={touched.address && !errors.address}
                    isInvalid={!!errors.address}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Telefone"
                  className="mb-1"
                >
                  <FormControlCustom.Control.Phone
                    name="phoneOne"
                    value={values.phoneOne ?? ""}
                    onChange={handleChange}
                    isValid={touched.phoneOne && !errors.phoneOne}
                    isInvalid={!!errors.phoneOne}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Celular"
                  className="mb-1"
                >
                  <FormControlCustom.Control.Phone
                    name="phoneTwo"
                    value={values.phoneTwo ?? ""}
                    onChange={handleChange}
                    isValid={touched.phoneTwo && !errors.phoneTwo}
                    isInvalid={!!errors.phoneTwo}
                  />
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
                    Atualizar
                  </Button>
                </Block>
              </Form.Group>
            </Form>
          </>
        )}
      </Formik>
      <Toast show={show} change={setShow} />
    </div>
  );
}
