"use client";

import React, { useState, useEffect } from "react";

const Syllabus = ({ blocks }) => {
  const [syllabus, setSyllabus] = useState([]);

  useEffect(() => {
    if (blocks && blocks.length > 0) {
      const extractSyllabus = () => {
        const sections = [];
        let currentSection = null;

        blocks.forEach((block) => {
          if (block.type === "header") {
            if (block.data.level === 2) {
              if (currentSection) {
                sections.push(currentSection);
              }
              currentSection = { section: block, subsections: [] };
            } else if (block.data.level === 3 && currentSection) {
              currentSection.subsections.push(block);
            }
          }
        });

        if (currentSection) {
          sections.push(currentSection);
        }

        setSyllabus(sections);
      };

      extractSyllabus();
    }
  }, [blocks]);

  return (
    <div className="m-12">
      
      <h2 className="text-3xl font-semibold mb-8">Syllabus</h2>
      {syllabus.map((section, index) => (
        <div
          key={section.section.id}
          className="collapse collapse-arrow bg-base-200 mb-4"
        >
          <input type="checkbox" />
          <div className="collapse-title text-xl font-medium">
            {section.section.data.text}
          </div>
          <div className="collapse-content">
            <ul className="list-disc list-inside">
              {section.subsections.map((subsection) => (
                <li key={subsection.id} className="ml-4">
                  {subsection.data.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Syllabus;
