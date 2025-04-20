import React from 'react';

/**
 * Parses custom markdown syntax into React elements
 * Current syntax support:
 * - **text** -> <strong>text</strong> (bold)
 * - ***text*** -> <strong className="text-primary">text</strong> (bold + primary color)
 * - _text_ -> <span className="text-primary underline">text</span> (underline + primary color)
 * - ****text**** -> <strong className="text-secondary">text</strong> (bold + secondary color)
 * - [br] -> <br /> (line break)
 * 
 * @param {string} text - The text containing markdown syntax
 * @returns {Array<React.ReactNode>} Array of text and React elements
 */
export const parseMarkdown = (text) => {
  if (!text) return '';

  // First split by line breaks
  return text.split(/(\[br\])/).map((part, index) => {
    if (part === '[br]') {
      return (<>
      <span className="my-2 block"></span>
      </>);
    }

    // Then split by primary bold, regular bold, and underline
    return part.split(/(\*\*\*\*.*?\*\*\*\*|\*\*\*.*?\*\*\*|\*\*.*?\*\*|_.*?_)/).map((subPart, subIndex) => {
      // Check for secondary bold (****text****) first
      if (subPart.startsWith('****') && subPart.endsWith('****')) {
        return <strong key={`${index}-${subIndex}`} className="text-secondary">{subPart.slice(4, -4)}</strong>;
      }
      // Check for primary bold (***text***) second
      if (subPart.startsWith('***') && subPart.endsWith('***')) {
        return <strong key={`${index}-${subIndex}`} className="text-primary">{subPart.slice(3, -3)}</strong>;
      }
      // Check for regular bold (**text**) third
      if (subPart.startsWith('**') && subPart.endsWith('**')) {
        return <strong key={`${index}-${subIndex}`}>{subPart.slice(2, -2)}</strong>;
      }
      // Check for underline (_text_) last
      if (subPart.startsWith('_') && subPart.endsWith('_')) {
        return <span key={`${index}-${subIndex}`} className="underline underline-offset-8 decoration-4 decoration-primary">{subPart.slice(1, -1)}</span>;
      }
      return subPart;
    });
  }).flat();
};