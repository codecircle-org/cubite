import React from "react";
import { parseMarkdown } from "@/app/utils/markdownParser";

// Example data: {"blocks":[{"id":"53TdsnLxFZ","data":{"text":"Welcome to our Site","level":2,"alignment":"left"},"type":"header"}]}

interface Props {
  text: string;
  level: number;
  alignment: string;
}

const EditorHeader = ({ text, level, alignment }: Props) => {
  // Determine font size class based on level
  let fontSizeClass;
  switch (level) {
    case 1:
      fontSizeClass = "text-5xl font-black";
      break;
    case 2:
      fontSizeClass = "text-4xl font-extrabold";
      break;
    case 3:
      fontSizeClass = "text-3xl font-bold";
      break;
    case 4:
      fontSizeClass = "text-2xl font-semibold";
      break;
    case 5:
      fontSizeClass = "text-xl font-medium";
      break;
    case 6:
      fontSizeClass = "text-lg font-medium";
      break;
    default:
      fontSizeClass = "text-base";
  }

  // Determine alignment class
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

  // Combine classes
  const combinedClasses = ` my-6 ${fontSizeClass} ${alignmentClass}`;

  return <p className={combinedClasses}>{parseMarkdown(text)}</p>;
};

export default EditorHeader;
