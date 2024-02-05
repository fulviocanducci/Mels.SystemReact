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
import { useEffect, useState } from "react";
import ButtonLoading from "../../components/ButtonLoading";
import Loading from "../../components/Loading";

export default function UpdateRegistration() {
  const { client, setClient } = useClient();
  const [stateForm, setStateForm] = useState<boolean>(false);
  const [optionsSelect2, setOptionsSelect2] = useState<ISelect2>({
    value: 1,
    label: "",
  });
  const { Formik } = formik;
  const [show, setShow] = useState<boolean>(false);

  const schema = yup.object().shape({
    cpf: yup
      .string()
      .required()
      .test("test-invalid-cpf", "CPF inválido", (cpf) => validation.cpf(cpf)),
    name: yup.string().required(),
    sex: yup.number().required(),
    dateBirthday: yup.string().test("test-invalid-date", "Data inválida", (dateBirthday) => {
      return validation.dateOrEmpty(dateBirthday);
    }),
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
          .then((result) => {
            if (result.status === 200) {
              const clientRecord: ClientRecord = result.data;
              if (clientRecord !== null) {
                setClient(clientRecord);
                setClientLocalStorage(clientRecord);
                setShow(() => true);
              }
            }
          })
          .finally(() => {
            setStateForm(false);
          });
      }
    }
  }

  useEffect(() => {
    if (client && client.cityRecord && client.cityRecord.id && client.cityRecord.name && client.cityRecord.uf) {
      const data = {
        value: client.cityRecord.id,
        label: client.cityRecord.name + " - " + client.cityRecord.uf,
      };
      setOptionsSelect2(data);
    }
  }, [client]);

  if (!client) {
    return <Loading />;
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
          cityRecord: client?.cityRecord,
          phoneOne: client?.phoneOne,
          phoneTwo: client?.phoneTwo,
          academyId: client?.academyId,
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
                />
              </Form.Group>
              <Form.Group className="mb-2" controlId="exampleForm.address">
                <Form.Label className="mb-0">Endereço completo:</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  isValid={touched.address && !errors.address}
                  isInvalid={!!errors.address}
                  placeholder="Endereço completo"
                />
              </Form.Group>
              <Form.Group className="mb-2" controlId="exampleForm.phoneOne">
                <Form.Label className="mb-0">Telefone:</Form.Label>
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
                <Form.Label className="mb-0">Celular:</Form.Label>
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
      <Toast message="Dados alterados com êxito." type="success" show={show} change={setShow} />
    </div>
  );
}
