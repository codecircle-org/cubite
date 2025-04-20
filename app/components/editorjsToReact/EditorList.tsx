import React from "react";
import he from 'he';

interface Props {
  style: string;
  items: string[];
}

const EditorList = ({ style, items }: Props) => {
  const renderListItem = (item: string, index: number) => {
    const decodedContent = he.decode(item);
    return (
      <li 
        key={index} 
        className="leading-relaxed"
        dangerouslySetInnerHTML={{ __html: decodedContent }}
      />
    );
  };

  if (style === "ordered") {
    return (
      <ol className="list-decimal my-8 prose px-8 py-2">
        {items.map((item, index) => renderListItem(item, index))}
      </ol>
    );
  } else {
    return (
      <ul className="list-disc my-8 prose px-8 py-2">
        {items.map((item, index) => renderListItem(item, index))}
      </ul>
    );
  }
};

export default EditorList;
