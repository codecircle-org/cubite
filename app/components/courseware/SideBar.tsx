import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const SideBar = ({ blocks, onSelectUnit, progress }) => {
  const handleClick = (sectionIndex, subsectionIndex, unitId) => {
    const headers = blocks.filter(
      (block) => block.type === "header" && block.data.level === 2
    );
    const section = headers[sectionIndex];
    const sectionIndexInBlocks = blocks.indexOf(section);

    const nextSectionIndexInBlocks = headers[sectionIndex + 1]
      ? blocks.indexOf(headers[sectionIndex + 1])
      : blocks.length;

    const sectionContent = blocks.slice(
      sectionIndexInBlocks,
      nextSectionIndexInBlocks
    );

    const subsections = sectionContent.filter(
      (block) => block.type === "header" && block.data.level === 3
    );

    const subsection = subsections[subsectionIndex];
    const subsectionIndexInBlocks = sectionContent.indexOf(subsection);

    const nextSubsectionIndexInBlocks = subsections[subsectionIndex + 1]
      ? sectionContent.indexOf(subsections[subsectionIndex + 1])
      : sectionContent.length;

    const subsectionContent = sectionContent.slice(
      subsectionIndexInBlocks,
      nextSubsectionIndexInBlocks
    );

    onSelectUnit(subsectionContent, sectionIndex + 1, unitId);
  };

  const isSubsectionComplete = (subsectionId) => {
    return progress[subsectionId] === 1;
  };

  const isSectionComplete = (sectionContent) => {
    const subsections = sectionContent.filter(
      (block) => block.type === "header" && block.data.level === 3
    );
    return subsections.every((subsection) =>
      isSubsectionComplete(subsection.id)
    );
  };

  return (
    <ul className="menu bg-base-200 rounded-box w-56">
      {blocks
        .filter((block) => block.type === "header" && block.data.level === 2)
        .map((section, sectionIndex) => {
          const sectionIndexInBlocks = blocks.indexOf(section);
          const nextSectionIndexInBlocks = blocks.findIndex(
            (block, idx) =>
              idx > sectionIndexInBlocks &&
              block.type === "header" &&
              block.data.level === 2
          );
          const sectionContent = blocks.slice(
            sectionIndexInBlocks,
            nextSectionIndexInBlocks === -1
              ? blocks.length
              : nextSectionIndexInBlocks
          );

          return (
            <li key={section.id}>
              <details>
                <summary>
                  {section.data.text}{" "}
                  {isSectionComplete(sectionContent) && (
                    <CheckCircleIcon className="w-4 h-4 text-green-500 inline-block" />
                  )}
                </summary>
                <ul>
                  {sectionContent
                    .filter(
                      (block) =>
                        block.type === "header" && block.data.level === 3
                    )
                    .map((subsection, subsectionIndex) => (
                      <li key={subsection.id}>
                        <a
                          onClick={() =>
                            handleClick(
                              sectionIndex,
                              subsectionIndex,
                              subsection.id
                            )
                          }
                        >
                          {subsection.data.text}{" "}
                          {isSubsectionComplete(subsection.id) && (
                            <CheckCircleIcon className="w-4 h-4 text-green-500 inline-block" />
                          )}
                        </a>
                      </li>
                    ))}
                </ul>
              </details>
            </li>
          );
        })}
    </ul>
  );
};

export default SideBar;
