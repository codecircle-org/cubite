"use client";

import React, { useState } from 'react';

interface Option {
  text: string;
  isCorrect: boolean;
}

interface CheckboxData {
  weight: string;
  options: Option[];
  questionText: string;
}

interface Props {
  data: CheckboxData;
}

const EditorCheckbox: React.FC<Props> = ({ data }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [usedAttempts, setUsedAttempts] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  return (
    <div className="my-8 p-8 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{data.questionText}</h3>
      <ul className="space-y-4">
        
        {data.options.map((option, index) => (
          <li key={index}>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="checkbox"
                checked={selectedOption === index}
                onChange={() => handleOptionSelect(index)}
                className="checkbox checkbox-primary"
              />
              <span className={`${showResult && option.isCorrect ? 'text-green-500 font-medium' : ''}`}>
                {option.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <button 
          onClick={handleSubmit} 
          className="btn btn-primary"
          disabled={selectedOption === null || showResult}
        >
          Submit
        </button>
      </div>
      {showResult && (
        <div className="mt-4">
          {data.options[selectedOption!].isCorrect ? (
            <p className="text-green-500">Correct!</p>
          ) : (
            <p className="text-error">Incorrect. Try again!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EditorCheckbox;