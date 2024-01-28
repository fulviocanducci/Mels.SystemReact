import React from "react";

interface IBlock {
  children: React.ReactNode;
}

export default function Block({ children }: IBlock) {
  return <div className="d-grid gap-2">{children}</div>;
}
