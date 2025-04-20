import React from "react";
//"data":{"content":[["fullname","username"],["seyedamir tadrisi","amirtds@gmail.com"],["Julian&nbsp;","keanululi@gmail.com"]],"withHeadings":false},"type":"table"}
//"data":{"content":[["fullname","username"],["seyedamir tadrisi","amirtds@gmail.com"],["Julian&nbsp;","keanululi@gmail.com"]],"withHeadings":true},"type":"table"}

interface Props {
  withHeadings: boolean;
  content: string[][];
}

const EditorTable = ({ withHeadings, content }: Props) => {
  return (
    <div className="overflow-x-auto my-8">
      <table className="table">
        {withHeadings && (
          <thead className="text-left capitalize">
            <tr>
              {content[0].map((heading, index) => (
                <th key={index}>{heading}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {content.slice(withHeadings ? 1 : 0).map((row, rowIndex) => (
            <tr key={rowIndex} className="hover">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditorTable;
