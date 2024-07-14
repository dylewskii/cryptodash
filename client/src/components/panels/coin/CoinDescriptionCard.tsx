import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { stripHtml } from "@/lib";

interface CoinDescriptionProps {
  description: string;
  className?: string;
}

export default function CoinDescriptionCard({
  description,
  className,
}: CoinDescriptionProps) {
  const cleanDescription = stripHtml(description);

  // split into sentences
  const cleanDescriptionLines = cleanDescription.split(".");

  // adds a line break every X lines (set by the breakpoint provided)
  const addLineBreaks = (lines: string[], breakpoint: number) => {
    return lines.map((line, index) => {
      // add line break before every X line (except the first one)
      const shouldAddLineBreak = index > 0 && index % breakpoint === 0;

      return (
        <React.Fragment key={index}>
          {shouldAddLineBreak && (
            <>
              <br /> <br />
            </>
          )}
          <span>
            {line.trim()}
            {index < lines.length - 1 ? "." : ""}
          </span>{" "}
          {/* don't delete this space (added after each sentence)*/}
        </React.Fragment>
      );
    });
  };

  return (
    <Card className={`border-t-2 border-black p-6 ${className}`}>
      <CardTitle className="mb-6">Token Description</CardTitle>
      <CardContent>
        <p
          className="
          first-line:uppercase 
          first-line:tracking-widest 
          first-letter:text-7xl 
          first-letter:font-bold 
          first-letter:text-gray-900 
          dark:first-letter:text-gray-100 
          first-letter:me-3 
          first-letter:float-start
        "
        >
          {addLineBreaks(cleanDescriptionLines, 6)}
        </p>
      </CardContent>
    </Card>
  );
}
