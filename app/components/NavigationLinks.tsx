"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";

const NavigationLinks = ({
  onLinksChange,
  title,
  existingLink,
}) => {
  const [links, setLinks] = useState(
    existingLink ? existingLink : [{ text: "", type: "internal", url: "" }]
  );

  useEffect(() => {
    if (JSON.stringify(links) !== JSON.stringify(existingLink)) {
      onLinksChange(links);
    }
  }, [links, onLinksChange, existingLink]);

  const handleAddLink = () => {
    setLinks([...links, { text: "", type: "internal", url: "" }]);
  };

  const handleRemoveLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = links.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setLinks(newLinks);
  };

  return (
    <div>
      <h3 className="font-medium ">{title}</h3>
      <ul>
        {links.map((link, index) => (
          <li key={index} className="flex">
            <label className="form-control max-w-xs m-1 flex-none w-1/4">
              <input
                type="text"
                name="link_text"
                required
                value={link.text}
                className="input input-bordered w-full max-w-xs input-md m-1"
                placeholder="Link Text"
                onChange={(e) =>
                  handleLinkChange(index, "text", e.target.value)
                }
              />
            </label>
            <select
              className="select select-bordered max-w-xs flex-none w-1/4 mt-2 ml-2"
              value={link.type}
              onChange={(e) => handleLinkChange(index, "type", e.target.value)}
            >
              <option disabled>Type</option>
              <option value={"internal"}>Internal</option>
              <option value={"external"}>External</option>
              <option value={"primary-button"}>Primary Button</option>
              <option value={"neutral-button"}>Neutral Button</option>
            </select>

            <label className="form-control max-w-xs m-1 flex-none w-1/4">
              <input
                type="text"
                value={link.url}
                required
                placeholder="Link URL"
                name="link_url"
                className="input input-bordered w-full max-w-xs input-md m-1"
                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              />
            </label>
            <button
              onClick={() => handleRemoveLink(index)}
              className="m-2 px-4 btn btn-outline btn-error"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={handleAddLink}
        className="my-2 btn btn-outline btn-sm btn-secondary"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default NavigationLinks;
