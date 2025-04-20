// "data":{"text":"hello world is not good way to learn programming languages","caption":"seyedamir tadrisi","alignment":"left"},"type":"quote"}

import React from "react";

interface Props {
  text: string;
  caption: string;
  alignment: "left" | "center" | "right";
}

const EditorQuote = ({ text, caption, alignment }: Props) => {
  let alignmentClass;
  switch (alignment) {
    case "left":
      alignmentClass = "text-left";
      break;
    case "center":
      alignmentClass = "text-center";
      break;
    case "right":
      alignmentClass = "text-right";
      break;
    default:
      alignmentClass = "text-left";
  }

  return (
    <div className={`p-4 my-4 border-l-4 border-gray-500 ${alignmentClass}`}>
      <blockquote className="italic text-lg">{text}</blockquote>
      <figcaption className="mt-2 text-sm text-gray-500">
        — {caption}
      </figcaption>
    </div>
  );
};

export default EditorQuote;
