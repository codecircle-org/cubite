"use client";

import React, { useEffect, useState } from "react";

interface Option {
  name: string;
}

interface Props {
  title: string;
  onChange?: (options: Option[]) => void;
  preSelectedOptions?: Option[];
}

const MultiInput = ({ title, onChange, preSelectedOptions = [] }: Props) => {
  const [options, setOptions] = useState<Option[]>(preSelectedOptions);

  useEffect(() => {
    setOptions(preSelectedOptions);
  }, [JSON.stringify(preSelectedOptions)]);

  const handleAddElement = (e) => {
    if (e.key === "Enter" && e.target.value) {
      e.preventDefault();
      const newOption: Option = { name: e.target.value };
      if (!options.some((option) => option.name === newOption.name)) {
        const updatedOptions = [...options, newOption];
        setOptions(updatedOptions);
        if (onChange) {
          onChange(updatedOptions);
        }
      }
      e.target.value = ""; // Clear the input field
    }
  };

  const handleRemoveElement = (optionToRemove: Option) => {
    const filteredOptions = options.filter(
      (option) => option.name !== optionToRemove.name
    );
    setOptions(filteredOptions);
    if (onChange) {
      onChange(filteredOptions);
    }
  };

  return (
    <div className="sm:col-span-2">
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">{title}</span>
        </div>
      </label>
      <input
        type="text"
        id="courseSubjects"
        name="courseSubjects"
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs"
        onKeyDown={handleAddElement}
      />
      <div className="label">
        <span className="label-text-alt">
          Write the {title} and hit the enter
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {options.map((option, index) => (
          <div
            key={index}
            className="badge badge-outline badge-secondary badge-md"
          >
            {option.name}
            <button
              type="button"
              className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20"
              onClick={() => handleRemoveElement(option)}
            >
              <span className="sr-only">Remove</span>
              <svg
                viewBox="0 0 14 14"
                className="h-3.5 w-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75"
              >
                <path d="M4 4l6 6m0-6l-6 6" />
              </svg>
              <span className="absolute -inset-1" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiInput;
