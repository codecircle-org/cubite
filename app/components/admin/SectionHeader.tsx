import React from "react";

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="font-semibold leading-7 text-lg">{title}</h2>
      <p className="mt-1 text-sm leading-6">{description}</p>
    </div>
  );
}

export default SectionHeader;
