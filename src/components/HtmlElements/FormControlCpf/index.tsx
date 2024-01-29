import { FormControl } from "react-bootstrap";
import { withMask } from "use-mask-input";
import { IFormControlCpf } from "../../../@types";

export function FormControlCpf({ name, value, onChange, isValid, isInvalid }: IFormControlCpf) {
  return <FormControl type="text" name={name} isInvalid={isInvalid} isValid={isValid} size="sm" value={value} onChange={onChange} placeholder="CPF" ref={withMask("999.999.999-99")} />;
}
