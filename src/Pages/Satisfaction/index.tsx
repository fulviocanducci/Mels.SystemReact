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
import { formats } from "../../utils";

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
                .of(
                  yup
                    .mixed()
                    .oneOf(item.satisfactionLists.map((x) => "" + x.id))
                )
                .min(1, "Selecione pelo menos uma opção")
                .max(item.questionQuantity, "No máximo 3 opções")
                .required();
            }
            break;
          }
          default: {
            label = "description" + item.id;
            shape[label] = yup.string().required();
          }
        }
      }
      console.log(shape);
      const schema = yup.object().shape(shape);
      return schema;
    }
    return {};
  }
  function initialValuesDynamicBySatisfaction() {
    if (satisfaction != null) {
      let items = {} as any;
      let label = "";
      let value = null;
      for (let item of satisfaction) {
        switch (item.questionType) {
          case "L": {
            label =
              (item.questionQuantity <= 1 ? "radio" : "checkbox") +
              item.satisfactionLists[0].satisfactionId;
            value = item.questionQuantity <= 1 ? 0 : [];
            items[label] = value;
            break;
          }
          default: {
            label = "description" + item.id;
            items[label] = value;
          }
        }
      }
      console.log(items);
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
  function objectKeysToObject(data: any) {
    return Object.keys(data).map((item) => {
      const match = item.match(/^([a-zA-Z]+)(\d+)$/);
      if (match) {
        return {
          text: match[1],
          number: parseInt(match[2], 10),
          name: item,
        };
      }
      return { text: "", number: 0, name: "" };
    });
  }
  function handleFormSubmit(data: any) {
    const keys = Object.keys(data);
    if (keys.length > 0) {
      const keysItems = objectKeysToObject(data);
      for (let i = 0; i < keysItems.length; i++) {
        if (keysItems[i].text && keysItems[i].text.length == 0) continue;
        switch (keysItems[i].text) {
          case "radio": {
            const satisfactionAnswerList = {
              id: 0,
              cpf: client?.cpf,
              satisfactionId: keysItems[i]?.number,
              satisfactionListId: parseInt(data[keysItems[i]?.name], 10),
            };
            console.log(satisfactionAnswerList);
            break;
          }
          case "checkbox": {
            for (let j = 0; j < data[keysItems[i]?.name].length; j++) {
              const satisfactionAnswerList = {
                id: 0,
                cpf: client?.cpf,
                satisfactionId: keysItems[i]?.number,
                satisfactionListId: parseInt(data[keysItems[i]?.name][j], 10),
              };
              console.log(satisfactionAnswerList);
            }
            break;
          }
          case "description": {
            const satisfactionAnswer = {
              id: 0,
              cpf: client?.cpf,
              academyId: client?.academyId,
              satisfactionId: keysItems[i]?.number,
              response: data[keysItems[i]?.name],
              responseDate: formats.nowDateTime(),
            };
            console.log(satisfactionAnswer);
            break;
          }
        }
      }
    } else {
      alert("error of submit");
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
        onSubmit={handleFormSubmit}
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
                            isValid={
                              touched["radio" + list.satisfactionId] &&
                              !errors["radio" + list.satisfactionId]
                            }
                            isInvalid={!!errors["radio" + list.satisfactionId]}
                          />
                        </>
                      ))}
                    {item.questionType == "L" &&
                      item.questionQuantity > 1 &&
                      item.satisfactionLists.map((list, index) => (
                        <Form.Check
                          key={index}
                          type={"checkbox"}
                          name={"checkbox" + list.satisfactionId}
                          onChange={handleChange}
                          id={`default-${list.option}`}
                          label={list.option}
                          defaultValue={list.id}
                          isValid={
                            touched["checkbox" + list.satisfactionId] &&
                            !errors["checkbox" + list.satisfactionId]
                          }
                          isInvalid={!!errors["checkbox" + list.satisfactionId]}
                        />
                      ))}
                  </Form.Group>
                ))}
              <Block>
                <div>{JSON.stringify(values)}</div>
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
