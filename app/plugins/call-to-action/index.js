import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { parseMarkdown } from "../../utils/markdownParser";

class CallToAction {
  static get toolbox() {
    return {
      title: "Call To Action",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-milestone"><path d="M12 13v8"/><path d="M12 3v3"/><path d="M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.152-.365l3.424-2.317a1 1 0 0 0 0-1.635l-3.424-2.318A2 2 0 0 0 17 6z"/></svg>',
    };
  }

  constructor({ data, config }) {
    this.data = {
      title: data.title || "A better way to ship your projects",
      description:
        data.description ||
        "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua. Anim aute id magna aliqua ad ad non deserunt sunt.",
      buttonText: data.buttonText || "Get Started",
      buttonUrl: data.buttonUrl || "/",
      backgroundImage: data.backgroundImage || null,
      image: data.image || null,
      imagePosition: data.imagePosition || "left",
      hasBackgroundColour: data.hasBackgroundColour || false,
    };
    this.siteThemeName = config.siteThemeName;
  }

  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const CallToActionComponent = ({ initialData }) => {
      const [title, setTitle] = useState(
        initialData.title || "A better way to ship your projects"
      );
      const [description, setDescription] = useState(
        initialData.description ||
          "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua. Anim aute id magna aliqua ad ad non deserunt sunt."
      );
      const [buttonText, setButtonText] = useState(
        initialData.buttonText || "Get Started"
      );
      const [buttonUrl, setButtonUrl] = useState(initialData.buttonUrl || "/");
      const [hasBackgroundColour, setHasBackgroundColour] = useState(
        initialData.hasBackgroundColour || false
      );
      const [image, setImage] = useState(initialData.image || null);
      const [imagePosition, setImagePosition] = useState(
        initialData.imagePosition || "left"
      );
      const [tabId] = useState(Math.floor(Math.random() * 10000));

      const handleTitleChange = (e) => {
        setTitle(e.target.value);
        this.data.title = e.target.value;
      };

      const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        this.data.description = e.target.value;
      };

      const handleButtonTextChange = (e) => {
        setButtonText(e.target.value);
        this.data.buttonText = e.target.value;
      };

      const handleButtonUrlChange = (e) => {
        setButtonUrl(e.target.value);
        this.data.buttonUrl = e.target.value;
      };

      const handleHasBackgroundColourChange = (e) => {
        setHasBackgroundColour(e.target.checked);
        this.data.hasBackgroundColour = e.target.checked;
      };

      const handleUploadSuccess = (src) => {
        this.data.image = src;
        setImage(src);
      };

      const handleBackgroundColourChange = (e) => {
        setHasBackgroundColour(e.target.checked);
        this.data.hasBackgroundColour = e.target.checked;
      };

      return (
        <div
          role="tablist"
          className="tabs tabs-lifted my-4"
          data-theme={this.siteThemeName}
        >
          <input
            type="radio"
            name={`cta-${tabId}`}
            role="tab"
            className="tab"
            aria-label="Preview"
            defaultChecked
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div
              className={`grid ${
                image ? "grid-cols-4" : "grid-cols-3"
              } gap-4 p-8 relative ${
                hasBackgroundColour ? "bg-base-200/80" : ""
              }`}
            >
              <div
                className={`${image ? "col-span-2" : "col-span-3"} self-center`}
              >
                <p
                  className={`text-5xl font-bold mb-4 ${
                    image ? "w-full" : "w-2/3"
                  }`}
                >
                  {parseMarkdown(title)}
                </p>
                <p
                  className={`my-4 antialiased tracking-wide pt-4 w-full ${
                    image ? "lg:w-2/3 w-full" : "lg:w-1/2"
                  }`}
                >
                  {parseMarkdown(description)}
                </p>
                <Link
                  href={buttonUrl}
                  className="btn btn-primary !no-underline w-1/4 mt-4"
                >
                  {buttonText}
                </Link>
              </div>
              <div className="col-span-2 rounded-md self-center">
                {image && (
                  <Image
                    className="rounded-md"
                    src={`https://res.cloudinary.com/dn3cywkpn/image/upload/c_limit,w_1024/f_auto/q_auto/v1/${image}?_a=BAVCluDW0`}
                    height={500}
                    width={500}
                    alt="Call to action"
                  />
                )}
              </div>
            </div>
          </div>
          <input
            type="radio"
            name={`cta-${tabId}`}
            role="tab"
            className="tab"
            aria-label="Settings"
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div className="grid grid-cols-3 gap-4">
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
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Button Text</span>
                </div>
                <input
                  type="text"
                  placeholder={this.data.buttonText}
                  className="input input-bordered w-full max-w-xs"
                  value={buttonText}
                  onChange={handleButtonTextChange}
                />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Button URL</span>
                </div>
                <input
                  type="text"
                  placeholder={this.data.buttonUrl}
                  className="input input-bordered w-full max-w-xs"
                  value={buttonUrl}
                  onChange={handleButtonUrlChange}
                />
              </label>

              <label className="form-control col-span-full">
                <div className="label">
                  <span className="label-text">Description <br/> <span className="text-xs">(Use **text** for bold and ***text*** for primary bold)</span></span>
                </div>
                <textarea
                  className="textarea textarea-bordered textarea-md w-full h-24"
                  placeholder="Enter description here. Use **text** for bold text"
                  value={description}
                  onChange={handleDescriptionChange}
                ></textarea>
              </label>
              <div className="form-control col-span-2">
                  <label className="label cursor-pointer gap-2 justify-start">
                    <span className="label-text">Has Background Color</span>
                    <input
                      type="checkbox"
                      defaultChecked={hasBackgroundColour}
                      className="checkbox"
                      onChange={handleHasBackgroundColourChange}
                    />
                  </label>
                </div>
              <div className="form-control">
                <CldUploadWidget
                  uploadPreset="dtskghsx"
                  onSuccess={(results, options) => {
                    handleUploadSuccess(results.info?.public_id);
                  }}
                >
                  {({ open }) => (
                    <button onClick={open} className="btn btn-primary">
                      Upload Image
                    </button>
                  )}
                </CldUploadWidget>
              </div>
            </div>
          </div>
        </div>
      );
    };

    root.render(<CallToActionComponent initialData={this.data} />);
    return wrapper;
  }

  save(blockContent) {
    return {
      title: this.data.title,
      description: this.data.description,
      buttonText: this.data.buttonText,
      buttonUrl: this.data.buttonUrl,
      hasBackgroundColour: this.data.hasBackgroundColour,
      image: this.data.image,
      siteThemeName: this.data.siteThemeName,
    };
  }
}

export default CallToAction;
