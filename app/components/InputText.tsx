"use client";

import React from "react";

interface InputTextProps {
  label: string;
  placeholder: string;
  description: string;
  name: string;
  id: string;
  required?: boolean;
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

function InputText({
  label,
  placeholder,
  description,
  name,
  id,
  required = false,
  readOnly = false,
  value,
  onChange,
}: InputTextProps) {
  return (
    <div className="sm:col-span-2">
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <input
          type="text"
          name={name}
          id={id ? id : name}
          placeholder={placeholder}
          className="input input-bordered w-full max-w-xs"
          required={required}
          readOnly={readOnly}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <div className="label">
          <span className="label-text-alt">{description}</span>
        </div>
      </label>
    </div>
  );
}

export default InputText;
