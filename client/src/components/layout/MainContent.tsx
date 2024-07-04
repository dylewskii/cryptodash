import React from "react";

type MainContentProps = {
  children: React.ReactNode;
};

export const MainContent = ({ children }: MainContentProps) => {
  return <main className="flex-1 px-8">{children}</main>;
};
