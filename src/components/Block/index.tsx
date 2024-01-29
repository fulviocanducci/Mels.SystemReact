import { IBlock } from "../../@types";

export default function Block({ children }: IBlock) {
  return <div className="d-grid gap-2">{children}</div>;
}
