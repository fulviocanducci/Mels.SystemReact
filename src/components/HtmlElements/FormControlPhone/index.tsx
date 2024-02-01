import { FormControl } from "react-bootstrap";
import { withMask } from "use-mask-input";
import { IFormControlPhone } from "../../../@types";

export function FormControlPhone({
  name,
  value,
  onChange,
  isValid,
  isInvalid,
  placeholder,
}: IFormControlPhone) {
  return (
    <FormControl
      type="text"
      name={name}
      isInvalid={isInvalid}
      isValid={isValid}
      size="sm"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      ref={withMask(["(99)9999-9999", "(99)99999-9999"])}
    />
  );
}
