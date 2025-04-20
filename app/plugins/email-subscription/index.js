import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";
import { parseMarkdown } from "../../utils/markdownParser";

class EmailSubscription {
  static get toolbox() {
    return {
      title: "Email Subscription",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-app-window"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 4v4"/><path d="M2 8h20"/><path d="M6 4v4"/></svg>',
    };
  }

  constructor({ data, config }) {
    this.data = data || {
      title: "Subscribe to our newsletter",
      description:
        "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua. Anim aute id magna aliqua ad ad non deserunt sunt.",
      buttonText: "Subscribe",
      buttonUrl: "/",
      backgroundImage: null,
    };
    this.siteThemeName = config.siteThemeName;
  }

  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const EmailSubscriptionComponent = ({ initialData }) => {
      const [title, setTitle] = useState(
        initialData.title || "Subscribe to our newsletter"
      );
      const [description, setDescription] = useState(
        initialData.description ||
          "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua. Anim aute id magna aliqua ad ad non deserunt sunt."
      );
      const [buttonText, setButtonText] = useState(
        initialData.buttonText || "Subscribe"
      );
      const [buttonUrl, setButtonUrl] = useState(initialData.buttonUrl || "/");
      const [backgroundImage, setBackgroundImage] = useState(
        initialData.backgroundImage || null
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

      const handleUploadSuccess = (src) => {
        this.data.backgroundImage = src;
        setBackgroundImage(src);
      };

      return (
        <div
          role="tablist"
          className="tabs tabs-lifted"
          data-theme={this.siteThemeName}
        >
          <input
            type="radio"
            name={`email-subscription-${tabId}`}
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
              className={`grid grid-cols-3 gap-4 p-8 relative ${
                backgroundImage ? "bg-cover bg-center" : ""
              }`}
              style={
                backgroundImage
                  ? {
                      backgroundImage: `url(https://res.cloudinary.com/dn3cywkpn/image/upload/c_limit,w_2048/f_auto/q_auto/v1/${backgroundImage}?_a=BAVCluDW0)`,
                    }
                  : {}
              }
            >
              {backgroundImage && (
                <div className="absolute inset-0 bg-base-200/80"></div>
              )}
              <div className="relative col-span-full">
                <p className="text-5xl font-bold mb-4 w-2/3">
                  {parseMarkdown(title)}
                </p>
                <div className="flex flex-col gap-2">
                  <p className="mb-6 antialiased tracking-wide text-lg w-2/3">
                    {parseMarkdown(description)}
                  </p>
                  <label className="input input-bordered flex items-center gap-2 w-2/3">
                    Name
                    <input
                      type="text"
                      className="grow"
                      placeholder="Jane Doe"
                    />
                  </label>
                  <label className="input input-bordered flex items-center gap-2 w-2/3">
                    Email
                    <input
                      type="text"
                      className="grow"
                      placeholder="jane@doe.com"
                    />
                  </label>
                  <Link
                    href={buttonUrl}
                    className="btn btn-primary !no-underline w-1/4 mt-4"
                  >
                    {buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <input
            type="radio"
            name={`email-subscription-${tabId}`}
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
                  <span className="label-text">Description</span>
                </div>
                <textarea
                  className="textarea textarea-bordered textarea-md w-full h-24"
                  placeholder={this.data.description}
                  value={description}
                  onChange={handleDescriptionChange}
                ></textarea>
              </label>
              <CldUploadWidget
                uploadPreset="dtskghsx"
                onSuccess={(results, options) => {
                  handleUploadSuccess(results.info?.public_id);
                }}
              >
                {({ open }) => (
                  <div className="col-span-1">
                    <button onClick={open} className="btn btn-primary w-full">
                      Background Image
                    </button>
                  </div>
                )}
              </CldUploadWidget>
            </div>
          </div>
        </div>
      );
    };

    root.render(<EmailSubscriptionComponent initialData={this.data} />);
    return wrapper;
  }

  save(blockContent) {
    return {
      title: this.data.title || "Subscribe to our newsletter",
      description: this.data.description || "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua. Anim aute id magna aliqua ad ad non deserunt sunt.",
      backgroundImage: this.data.backgroundImage,
      buttonText: this.data.buttonText || "Subscribe",
      buttonUrl: this.data.buttonUrl || "/",
      siteThemeName: this.data.siteThemeName,
    };
  }
}

export default EmailSubscription;
