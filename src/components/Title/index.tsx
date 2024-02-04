import { ITitle } from "../../@types";
export default function Title({ description, children }: ITitle) {
  return (
    <>
      <h3 className="mb-1 text-success d-flex justify-content-between">
        {description ?? "Error"}
        {children ?? null}
      </h3>
      <hr className="mt-0 mb-2" />
    </>
  );
}
