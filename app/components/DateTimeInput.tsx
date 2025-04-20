"use client";

import React, { useState, useEffect } from "react";

interface Props {
  title: string;
  onChange?: (selectedDateTime: string) => void;
  defaultValue?: string;
}

const DateTimeInput = ({ title, onChange, defaultValue = "" }: Props) => {
  const [selectedDateTime, setSelectedDateTime] = useState(defaultValue);

  useEffect(() => {
    if (defaultValue) {
      const formattedValue = defaultValue.substring(0, 16);
      setSelectedDateTime(formattedValue);
    }
  }, [defaultValue]);

  const handleSelectDateTime = (e) => {
    const value = e.target.value;
    setSelectedDateTime(value);
    if (onChange) {
      onChange(value);
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
        type="datetime-local"
        max="2050-01-01T00:00"
        className="input input-bordered w-full max-w-xs"
        onChange={handleSelectDateTime}
        value={selectedDateTime || ""}
      />
      <div className="label">
        {/* <span className="label-text-alt">
          Enter the {title} in the format dd/mm/yyyy hh:mm
        </span> */}
      </div>
    </div>
  );
};

export default DateTimeInput;
