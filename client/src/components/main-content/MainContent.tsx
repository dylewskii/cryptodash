import React from "react";
import "./mainContent.css";

type MainContentProps = {
  children: React.ReactNode;
};

export default function MainContent({ children }: MainContentProps) {
  return (
    <main className="flex-1 px-8 mt-4 md:grid md:grid-cols-5 md:grid-rows-[auto_auto_auto] md:px-0 md:pr-8">
      {children}
    </main>
  );
}
