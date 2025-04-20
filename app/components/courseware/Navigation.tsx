import React from "react";

const Navigation = ({ courseName, progressPercentage }) => {
  return (
    <div className="flex flex-row border border-dashed p-4 mb-2">
      <p className="text-2xl font-black self-center">{courseName}</p>
      <div className="flex flex-row self-center ml-auto">
        <div
          className="radial-progress text-accent"
          style={{
            "--value": progressPercentage,
            "--size": "3.9rem",
            "--thickness": "0.3rem",
          }}
          role="progressbar"
        >
          {Math.round(progressPercentage)}%
        </div>
      </div>
    </div>
  );
};

export default Navigation;
