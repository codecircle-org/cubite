"use client";

import React, { useState } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { css } from '@codemirror/lang-css';
import { toast } from "react-hot-toast";

interface Site {
  id: string;
  domainName: string;
  customCss: string;
}

function SiteCustomCss({ site }: { site: Site }) {
  const [customCss, setCustomCss] = useState(site.customCss || "");
  const [isValid, setIsValid] = useState(true);

  const validateCSS = (cssString: string): boolean => {
    if (!cssString.trim()) return true; // Empty CSS is valid

    try {
      // Create a CSSStyleSheet instance
      const sheet = new CSSStyleSheet();
      // This will throw an error if the CSS is invalid
      sheet.replaceSync(cssString);
      
      // Additional security checks
      const lowercaseCSS = cssString.toLowerCase();
      const bannedKeywords = [
        'javascript:',
        'expression(',
        'url(',
        '@import',
        'script',
        '<',
        '>',
        'behavior',
        '-moz-binding'
      ];
      
      return !bannedKeywords.some(keyword => lowercaseCSS.includes(keyword));
    } catch (error) {
      console.error('CSS Validation Error:', error);
      return false;
    }
  };

  const handleEditorChange = (value: string) => {
    setCustomCss(value);
    const cssIsValid = validateCSS(value);
    setIsValid(cssIsValid);
  };

  const handleSave = async () => {
    if (!validateCSS(customCss)) {
      toast.error("Invalid CSS syntax or potentially unsafe code detected");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ROOT_URL}/api/site/${site.domainName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            siteId: site.id,
            updateData: {
              customCss: customCss,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update CSS');
      }

      toast.success("Custom CSS updated successfully");
    } catch (error) {
      console.error("Error updating custom CSS:", error);
      toast.error("Failed to update custom CSS");
    }
  };

  return (
    <div className="collapse collapse-arrow bg-base-200 my-2">
      <input type="radio" name="my-accordion-2" />
      <div className="collapse-title text-xl font-semibold">Custom Styling With CSS</div>
      <div className="collapse-content">
        <div className="m-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <label className="form-control w-full">
              <div className="label">
                {!isValid && (
                  <span className="label-text text-error">
                    Invalid CSS syntax or potentially unsafe code detected
                  </span>
                )}
              </div>
              <CodeMirror
                value={customCss}
                height="300px"
                extensions={[css()]}
                onChange={handleEditorChange}
                theme="dark"
                className={`border rounded-lg ${!isValid ? 'border-error' : 'border-base-300'}`}
              />
            </label>
            <button 
              onClick={handleSave}
              className="btn btn-primary btn-outline w-full mt-4"
              disabled={!isValid}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SiteCustomCss;