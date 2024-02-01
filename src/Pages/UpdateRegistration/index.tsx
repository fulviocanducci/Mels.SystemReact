import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import AsyncSelect from "react-select/async";

import * as formik from "formik";
import * as Icon from "react-bootstrap-icons";
import * as yup from "yup";

import { formats, validation } from "../../utils";
import Block from "../../components/Block";
import FormControlCustom from "../../components/HtmlElements";
import { useGetClient, useSetClient } from "../../@hooks";
import { request } from "../../@requests";
import { ClientRecord, ISelect2 } from "../../@types";
import Title from "../../components/Title";
import Toast from "../../components/Toast";
import { useEffect, useState } from "react";

export default function UpdateRegistration() {
  const client = useGetClient();
  const [optionsSelect2, setOptionsSelect2] = useState<ISelect2>({
    value: 1,
    label: "",
  });
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

  function setOptionsSelect2Handle(e: any, callBack: any) {
    setOptionsSelect2({ ...e });
    callBack("cityId", e.value);
  }

  function loadOptionsCitySelect2(
    inputValue: string,
    callback: (options: ISelect2[]) => void
  ) {
    request.citySelect2(inputValue).then((result) => {
      callback(result);
    });
  }

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

  useEffect(() => {
    console.log(client);
    if (
      client &&
      client.cityRecord &&
      client.cityRecord.id &&
      client.cityRecord.name &&
      client.cityRecord.uf
    ) {
      const data = {
        value: client.cityRecord.id,
        label: client.cityRecord.name + "-" + client.cityRecord.uf,
      };
      setOptionsSelect2({ ...data });
    }
  }, [client]);

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
          cityRecord: client?.cityRecord,
          phoneOne: client?.phoneOne,
          phoneTwo: client?.phoneTwo,
        }}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
          setFieldValue,
        }) => (
          <>
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group
                className="mb-1"
                controlId="exampleForm.ControlInputAll"
              >
                <FloatingLabel
                  controlId="floatingInputName"
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
                <FloatingLabel controlId="floatingSelectSexo" label="Sexo">
                  <Form.Select
                    name="sex"
                    className="mb-1"
                    value={values.sex}
                    onChange={handleChange}
                    isValid={touched.sex && !errors.sex}
                    isInvalid={!!errors.sex}
                    aria-label="Floating label select example"
                  >
                    <option value="1">Masculino</option>
                    <option value="2">Feminino</option>
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingInputDateBirthday"
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
                  controlId="floatingInputCity"
                  label="Cidade"
                  className="mb-1"
                >
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadOptionsCitySelect2}
                    defaultOptions={false}
                    value={optionsSelect2}
                    onChange={(e) => setOptionsSelect2Handle(e, setFieldValue)}
                    name="cityId"
                    id="cityId"
                    isSearchable={true}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingInputEmail"
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
                  controlId="floatingInputAddress"
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
                  controlId="floatingInputPhoneOne"
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
                  controlId="floatingInputPhoneTwo"
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
            <pre>{JSON.stringify(values)}</pre>
          </>
        )}
      </Formik>
      <Toast show={show} change={setShow} />
    </div>
  );
}
