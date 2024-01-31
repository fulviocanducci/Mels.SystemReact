import { FormControl } from "react-bootstrap";
import { withMask } from "use-mask-input";
import { IFormControlDate } from "../../../@types";

export function FormControlDate({
  name,
  value,
  onChange,
  isValid,
  isInvalid,
}: IFormControlDate) {
  return (
    <FormControl
      type="text"
      name={name}
      isInvalid={isInvalid}
      isValid={isValid}
      size="sm"
      value={value}
      onChange={onChange}
      placeholder="Data"
      ref={withMask("99/99/9999")}
    />
  );
}
