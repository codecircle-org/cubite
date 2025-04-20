import { createRoot } from "react-dom/client";
import React, { useState } from "react";
import { parseMarkdown } from "../../utils/markdownParser";

class Template {
  static get toolbox() {
    return {
      title: "Template",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-code"><path d="M10 9.5 8 12l2 2.5"/><path d="m14 9.5 2 2.5-2 2.5"/><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>',
    };
  }

  constructor({ data, config }) {
    this.data = data || {};
    this.siteId = config.siteId;
    this.siteThemeName = config.siteThemeName;
  }

  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const TemplateComponent = ({ initialData }) => {
      const [tabId] = useState(Math.floor(Math.random() * 10000));
      const [title, setTitle] = useState(initialData.title || "Template");
      const [description, setDescription] = useState(
        initialData.description || "Template"
      );

      return (
        <div
          role="tablist"
          className="tabs tabs-lifted my-4"
          data-theme={this.siteThemeName}
        >
          <input
            type="radio"
            name={`template-${tabId}`}
            role="tab"
            className="tab"
            aria-label="Preview"
            defaultChecked
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div>
              <h1>Template Preview</h1>
            </div>

          </div>
          <input
            type="radio"
            name={`template-${tabId}`}
            role="tab"
            className="tab"
            aria-label="Settings"
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <h1>Settings</h1>
            <div className="grid grid-flow-col grid-cols-3 gap-4 place-items-center">
              <div className="col-span-1 flex flex-col gap-8">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Title</span>
                  </div>
                  <input
                    type="text"
                    placeholder={this.data.title}
                    className="input input-bordered w-full max-w-xs"
                    value={title}
                    onChange={handleTitleChange}
                  />
                </label>
                <select className="select select-bordered w-full max-w-xs justify-self-end col-span-1">
                  <option disabled value="">
                    Dropdown
                  </option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                </select>

                <div className="form-control col-span-1">
                  <label className="label cursor-pointer gap-2">
                    <span className="label-text">Checkbox</span>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </div>
              </div>

              <label className="form-control w-full h-full col-span-2 row-span-3">
                <div className="label">
                  <span className="label-text">Description</span>
                </div>
                <textarea
                  type="text"
                  placeholder={this.data.description}
                  className="textarea textarea-bordered w-full h-full"
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </label>
            </div>
          </div>
        </div>
      );
    };

    root.render(<TemplateComponent initialData={this.data} />);

    return wrapper;
  }
  save(blockContent) {
    return {
      title: this.data.title,
      description: this.data.description,
      dropdown: this.data.dropdown,
      checkbox: this.data.checkbox,
    };
  }
}

export default Template;
