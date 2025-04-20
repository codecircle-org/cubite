"use client";

import React, { useEffect, useState } from "react";

interface Option {
  id: string;
  name: string;
}

interface Props {
  title: string;
  options: Option[];
  onChange?: (selectedOptions: Option[]) => void;
  isRequired?: boolean;
  preSelectedOptions?: Option[];
}

const MultiSelect = ({
  title,
  options,
  onChange,
  isRequired,
  preSelectedOptions = [],
}: Props) => {
  const [selectedOptions, setSelectedOptions] =
    useState<Option[]>(preSelectedOptions);

  useEffect(() => {
    setSelectedOptions(preSelectedOptions);
  }, [JSON.stringify(preSelectedOptions)]);

  const handleAddElement = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOptionId = e.target.value;
    const newOption = options.find((option) => option.id === newOptionId);
    if (
      newOption &&
      !selectedOptions.some((option) => option.id === newOption.id)
    ) {
      const updatedOptions = [...selectedOptions, newOption];
      setSelectedOptions(updatedOptions);
      if (onChange) {
        onChange(updatedOptions);
      }
    }
    e.target.value = ""; // Reset the select input
  };

  const handleRemoveElement = (optionToRemove: Option) => {
    const filteredOptions = selectedOptions.filter(
      (option) => option.id !== optionToRemove.id
    );
    setSelectedOptions(filteredOptions);
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
      <select
        className="select select-bordered w-full max-w-xs"
        onChange={handleAddElement}
        required={isRequired}
        defaultValue="" // Set default value to empty string
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <div className="label">
        <span className="label-text-alt">
          Select the {title} from the dropdown
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedOptions.map((option) => (
          <div
            key={option.id}
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

export default MultiSelect;
