import React from "react";
import { FormControl } from "react-bootstrap";
import { withMask } from "use-mask-input";

interface IFormControlCpf {
  name: string;
  value: string;
  isValid?: boolean | undefined;
  isInvalid?: boolean | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export function FormControlCpf({ name, value, onChange, isValid, isInvalid }: IFormControlCpf) {
  return <FormControl type="text" name={name} isInvalid={isInvalid} isValid={isValid} size="sm" value={value} onChange={onChange} placeholder="CPF" ref={withMask("999.999.999-99")} />;
}
