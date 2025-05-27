import { useEffect, useState } from "react";
import Title from "../../components/Title";
import Loading from "../../components/Loading";
import { request } from "../../@requests";
import { useClient } from "../../@hooks";
import { ISatisfaction } from "../../@types";
import * as formik from "formik";
import * as yup from "yup";
import * as Icon from "react-bootstrap-icons";
import Block from "../../components/Block";
import { Alert, Button, Form, Tab, Tabs } from "react-bootstrap";
import ButtonLoading from "../../components/ButtonLoading";

function Satisfaction() {
  const { Formik } = formik;
  const { client } = useClient();
  const [satisfaction, setSatisfaction] = useState<Array<ISatisfaction> | null>(
    null
  );
  const [stateUpdate, setStateUpdate] = useState<boolean>(false);

  function schemaDynamicBySatisfaction() {
    if (satisfaction != null) {
      const shape: Record<string, yup.AnySchema> = {};
      let label = "";
      for (let item of satisfaction) {
        switch (item.questionType) {
          case "L": {
            label =
              (item.questionQuantity <= 1 ? "radio" : "checkbox") +
              item.satisfactionLists[0].satisfactionId;
            if (item.questionQuantity <= 1) {
              shape[label] = yup
                .number()
                .oneOf(
                  item.satisfactionLists.map((x) => x.id),
                  "Selecione um gênero"
                )
                .required("Campo obrigatório");
            } else {
              shape[label] = yup
                .array()
                .of(yup.number())
                .min(1, "Selecione pelo menos uma opção")
                .max(3, "No máximo 3 opções");
            }
            break;
          }
          default: {
            label = "description" + item.id;
            shape[label] = yup.string().required();
          }
        }
      }
      const schema = yup.object().shape(shape);
      return schema;
    }
    return {};
  }
  function initialValuesDynamicBySatisfaction() {
    if (satisfaction != null) {
      let items = {} as any;
      let label = "";
      for (let item of satisfaction) {
        switch (item.questionType) {
          case "L": {
            label =
              (item.questionQuantity <= 1 ? "radio" : "checkbox") +
              item.satisfactionLists[0].satisfactionId;
            items[label] = 0;
            break;
          }
          default: {
            label = "description" + item.id;
            items[label] = "";
          }
        }
      }
      return items;
    }
    return {};
  }

  async function loadAllAsync() {
    if (client && client.academyId) {
      const response = await request.satisfactionGet(client.academyId);
      if (response.status === 200) {
        setSatisfaction(response.data as ISatisfaction[]);
      }
    }
  }

  useEffect(() => {
    loadAllAsync();
  }, [client]);

  if (satisfaction === null) {
    return <Loading />;
  }

  return (
    <div>
      <Title description="Pesquisa" />
      <Formik
        validateOnChange={true}
        validationSchema={schemaDynamicBySatisfaction()}
        onSubmit={() => {}}
        initialValues={initialValuesDynamicBySatisfaction()}
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
              {satisfaction &&
                satisfaction.map((item, index) => (
                  <Form.Group className="mb-2" controlId="exampleForm.title">
                    <Form.Label className="mb-0">{item.question}</Form.Label>
                    {item.questionType == "D" && (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        key={index}
                        type="text"
                        name={"description" + item.id}
                        value={values["description" + item.id]}
                        onChange={handleChange}
                        isValid={
                          touched["description" + item.id] &&
                          !errors["description" + item.id]
                        }
                        isInvalid={!!errors["description" + item.id]}
                        placeholder={item.question}
                      />
                    )}
                    {item.questionType == "L" &&
                      item.questionQuantity <= 1 &&
                      item.satisfactionLists.map((list, index) => (
                        <>
                          <Form.Check
                            key={index}
                            type={"radio"}
                            name={"radio" + list.satisfactionId}
                            id={`default-${list.option}`}
                            onChange={handleChange}
                            label={list.option}
                            defaultValue={list.id}
                            value={values["radio" + satisfaction]}
                            isValid={
                              touched["radio" + list.satisfactionId] &&
                              !errors["radio" + list.satisfactionId]
                            }
                            isInvalid={!!errors["radio" + list.satisfactionId]}
                          />
                          <div>{JSON.stringify(errors)}</div>
                        </>
                      ))}
                    {item.questionType == "L" &&
                      item.questionQuantity > 1 &&
                      item.satisfactionLists.map((list, index) => (
                        <Form.Check
                          key={index}
                          type={"checkbox"}
                          name={"checkbox" + list.satisfactionId}
                          id={`default-${list.option}`}
                          label={list.option}
                          value={list.id}
                        />
                      ))}
                  </Form.Group>
                ))}
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
                  {stateUpdate ? (
                    <>
                      <ButtonLoading /> Enviando ...
                    </>
                  ) : (
                    <>
                      <Icon.Save /> Enviar
                    </>
                  )}
                </Button>
              </Block>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default Satisfaction;
