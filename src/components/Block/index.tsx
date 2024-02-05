import { IBlock } from "../../@types";

export default function Block({ children, className }: IBlock) {
  return <div className={className ? className + " d-grid gap-2" : "d-grid gap-2"}>{children}</div>;
}
