import React from "react";
import "./mainContent.css";

type MainContentProps = {
  children: React.ReactNode;
};

export default function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 mt-4 px-8 md:grid md:grid-cols-5 md:px-14">
      {children}
    </main>
  );
}
