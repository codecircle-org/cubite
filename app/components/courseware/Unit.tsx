import React from "react";
import RenderEditorComponents from "@/app/components/editorjsToReact/RenderEditorComponents";

const Unit = ({ blocks }) => {
  return (
    <div>
      {blocks.length > 0 ? (
        <RenderEditorComponents blocks={blocks} site="" />
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
};

export default Unit;
