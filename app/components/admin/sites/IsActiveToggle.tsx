"use client";

import React from "react";

interface IsActiveToggleProps {
  isActive: boolean;
  handleIsActive: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function IsActiveToggle({
  isActive,
  handleIsActive,
}: IsActiveToggleProps) {
  return (
    <div className="form-control w-52 mb-4">
      <label className="cursor-pointer label">
        <span className="label-text font-medium text-lg">Is Active</span>
        <input
          className="toggle toggle-secondary"
          id="isActive"
          name="isActive"
          type="checkbox"
          defaultChecked={isActive}
          onChange={handleIsActive}
        />
      </label>
    </div>
  );
}

export default IsActiveToggle;
