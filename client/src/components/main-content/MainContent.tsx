import React from "react";
import "./mainContent.scss";

type MainContentProps = {
  children: React.ReactNode;
};

export default function MainContent({ children }: MainContentProps) {
  return <main className="flex-1 mainContent">{children}</main>;
}
