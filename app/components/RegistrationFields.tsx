"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";

const RegistrationFields = ({ onFieldChange, title, existingFields }) => {
  const [fields, setFields] = useState(existingFields ? existingFields : []);

  useEffect(() => {
    onFieldChange(fields);
  }, [fields, onFieldChange]);

  const handleAddField = () => {
    setFields([...fields, { 
      text: "", 
      type: "text", 
      required: false,
      options: []
    }]);
  };

  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handleFieldChange = (index, fieldKey, value) => {
    const newFields = fields.map((field, i) =>
      i === index ? { ...field, [fieldKey]: value } : field
    );
    setFields(newFields);
  };

  const handleAddOption = (fieldIndex) => {
    const newFields = fields.map((field, i) => {
      if (i === fieldIndex) {
        return {
          ...field,
          options: [...(field.options || []), { value: "", label: "" }]
        };
      }
      return field;
    });
    setFields(newFields);
  };

  const handleOptionChange = (fieldIndex, optionIndex, key, value) => {
    const newFields = fields.map((field, i) => {
      if (i === fieldIndex) {
        const newOptions = (field.options || []).map((option, j) => {
          if (j === optionIndex) {
            return { ...option, [key]: value };
          }
          return option;
        });
        return { ...field, options: newOptions };
      }
      return field;
    });
    setFields(newFields);
  };

  const handleRemoveOption = (fieldIndex, optionIndex) => {
    const newFields = fields.map((field, i) => {
      if (i === fieldIndex) {
        const newOptions = (field.options || []).filter((_, j) => j !== optionIndex);
        return { ...field, options: newOptions };
      }
      return field;
    });
    setFields(newFields);
  };

  return (
    <div className="w-full border-2 border-dashed border-gray-100 p-4">
      <h3 className="font-medium">{title}</h3>
      <ul>
        {fields.map((field, index) => (
          <li key={index} className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <label className="form-control max-w-xs flex-none w-2/6">
                <input
                  type="text"
                  name="fieldtext"
                  required
                  value={field.text}
                  className="input input-bordered w-full max-w-xs input-md"
                  placeholder="Field Text"
                  onChange={(e) => handleFieldChange(index, "text", e.target.value)}
                />
              </label>
              <select
                className="select select-bordered flex-none w-1/4"
                value={field.type}
                onChange={(e) => handleFieldChange(index, "type", e.target.value)}
              >
                <option disabled>Select Field Type</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="dropdown">Dropdown</option>
              </select>

              <select
                className="select select-bordered flex-none w-1/4"
                value={field.required.toString()}
                onChange={(e) =>
                  handleFieldChange(index, "required", e.target.value === "true")
                }
              >
                <option disabled>Required</option>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
              <button
                onClick={() => handleRemoveField(index)}
                className="m-2 px-4 btn btn-outline btn-error"
              >
                <TrashIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Dropdown Options Section */}
            {field.type === "dropdown" && (
              <div className="ml-8 mt-2">
                <div className="text-sm text-gray-600 mb-2">Dropdown Options:</div>
                {(field.options || []).map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={option.value}
                      placeholder="Value"
                      className="input input-bordered input-sm w-32"
                      onChange={(e) => 
                        handleOptionChange(index, optionIndex, "value", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      value={option.label}
                      placeholder="Label"
                      className="input input-bordered input-sm w-32"
                      onChange={(e) => 
                        handleOptionChange(index, optionIndex, "label", e.target.value)
                      }
                    />
                    <button
                      onClick={() => handleRemoveOption(index, optionIndex)}
                      className="btn btn-ghost btn-xs text-error"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddOption(index)}
                  className="btn btn-ghost btn-xs btn-secondary"
                >
                  <PlusIcon className="h-4 w-4" /> Add Option
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={handleAddField}
        className="my-2 btn btn-outline btn-sm btn-secondary"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default RegistrationFields;
