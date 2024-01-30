import { ITitle } from "../../@types";

export default function Title({ description }: ITitle) {
  return (
    <>
      <h3 className="mb-1 text-success">{description ?? "Error"}</h3>
      <hr className="mt-0 mb-2" />
    </>
  );
}
