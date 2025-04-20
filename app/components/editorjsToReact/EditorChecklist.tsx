// "data":{"items":[{"text":"item 1","checked":false},{"text":"item 2","checked":false},{"text":"item 3","checked":false}]},"type":"checklist"}

import React from "react";

interface ChecklistItem {
  text: string;
  checked: boolean;
}

interface Props {
  items: ChecklistItem[];
}

const EditorChecklist = ({ items }: Props) => {
  return (
    <div className="my-8">
      {items.map((item, index) => (
        <label key={index} className="label cursor-pointer max-w-fit">
          <input
            type="checkbox"
            defaultChecked={item.checked}
            className="checkbox"
          />
          <span className="label-text capitalize mx-2">{item.text}</span>
        </label>
      ))}
    </div>
  );
};

export default EditorChecklist;
