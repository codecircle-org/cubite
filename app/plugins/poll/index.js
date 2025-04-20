import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";

class Poll {
  static get toolbox() {
    return {
      title: "Poll",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>',
    };
  }

  constructor({ data }) {
    this.data = data
      ? data
      : {
          questionText: "Who is the best Youtube ?",
          options: [{ text: "Option 1", isCorrect: false }],
        };
  }

  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const PollComponent = ({ initialData }) => {
      const [options, setOptions] = useState(
        initialData.options || [{ text: "Option 1", isCorrect: false }]
      );
      const [questionText, setQuestionText] = useState(
        initialData.questionText || "Who is the best Youtube ?"
      );
      const optionRefs = useRef([]);

      useEffect(() => {
        if (optionRefs.current[0]) {
          optionRefs.current[0].focus();
        }
      }, []);

      const handleKeyOnOption = (e, index) => {
        if (e.key === "Enter") {
          if (e.target.value === "") {
            // Remove the empty option
            const newOptions = options.filter((_, i) => i !== index);
            this.data.options = newOptions;
            setOptions(newOptions);
            // Allow Editor.js to handle Enter if the current option is empty
            return;
          } else {
            e.preventDefault(); // Prevent default behavior of Enter key
            e.stopPropagation(); // Prevent propagation to Editor.js
            const newOptions = [...options, { text: "", isCorrect: false }];
            this.data.options = newOptions;
            setOptions(newOptions);
            setTimeout(() => {
              optionRefs.current[index + 1]?.focus();
            }, 0);
          }
        } else if (e.key === "Backspace" && e.target.value === "") {
          if (options.length > 1) {
            const newOptions = options.filter((_, i) => i !== index);
            this.data.options = newOptions;
            setOptions(newOptions);
            setTimeout(() => {
              if (index > 0) {
                optionRefs.current[index - 1]?.focus();
              } else if (optionRefs.current[0]) {
                optionRefs.current[0].focus();
              }
            }, 0);
          }
        }
      };

      const handleOptionChange = (index, newText) => {
        const newOptions = [...options];
        newOptions[index].text = newText;
        this.data.options = newOptions;
        setOptions(newOptions);
      };

      const handleQuestionText = (e) => {
        const newQuestionText = e.target.innerText;
        this.data.questionText = newQuestionText;
        setQuestionText(newQuestionText);
      };

      const handleRadioChange = (index) => {
        const newOptions = options.map((option, i) => ({
          ...option,
          isCorrect: i === index,
        }));
        this.data.options = newOptions;
        setOptions(newOptions);
      };

      return (
        <div>
          <p
            className="text-md focus:outline-none"
            contentEditable={true}
            suppressContentEditableWarning={true}
            onInput={handleQuestionText}
          >
            {questionText}
          </p>
          <fieldset>
            <legend className="sr-only">Options</legend>
            <div className="space-y-5">
              {options.map((option, index) => (
                <div className="relative flex items-start" key={index}>
                  <div className="flex h-6 items-center">
                    <input
                      id={`option-${index}`}
                      aria-describedby={`option-${index}-description`}
                      name="multiple-choice-options"
                      type="radio"
                      checked={option.isCorrect}
                      onChange={() => handleRadioChange(index)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6 flex-1">
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyOnOption(e, index)}
                      ref={(el) => (optionRefs.current[index] = el)}
                      className="font-medium text-gray-900 focus:outline-none w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        </div>
      );
    };

    root.render(<PollComponent initialData={this.data} />);
    return wrapper;
  }

  save(blockContent) {
    return {
      questionText: this.data.questionText,
      options: this.data.options,
    };
  }
}

export default Poll;
