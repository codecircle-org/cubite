// {"time":1719247614396,"blocks":[{"id":"od2vZL247W","data":{"text":"this is test paragraph","alignment":"left"},"type":"paragraph"}]}

import React from "react";
import { parseMarkdown } from "@/app/utils/markdownParser";
import parse from "html-react-parser";

interface Props {
  text: string;
  alignment: string;
}

const EditorParagraph = ({ text, alignment }: Props) => {
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
  const combinedClasses = `${alignmentClass}`;

  return <div className={combinedClasses}>{parse(text)}</div>;
};

export default EditorParagraph;
