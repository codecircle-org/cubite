import { CldImage } from "next-cloudinary";
import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { CldUploadWidget } from "next-cloudinary";

class Image {
  static get toolbox() {
    return {
      title: "Image",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>',
    };
  }

  constructor({ data }) {
    this.data = data || {};
  }

  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const ImageComponent = ({ initialData }) => {
      const [src, setSrc] = useState(initialData.src);
      const [caption, setCaption] = useState(initialData.caption);
      const handleUploadSuccess = (results) => {
        const uploadedSrc = results.info?.public_id;
        setSrc(uploadedSrc);
        this.data.src = uploadedSrc; // Update the plugin data
      };
      const handleCaption = (e) => {
        const newCaption = e.target.value;
        setCaption(newCaption);
        this.data.caption = newCaption;
      };
      const inputRef = useRef("");
      useEffect(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      });

      return (
        <div className="items-center my-4">
          {src ? (
            <CldImage
              width="900"
              height="500"
              src={src}
              sizes="100vw"
              alt="Uploaded Image"
              className=""
            />
          ) : (
            <img
              className="w-full"
              src="https://placehold.co/600x400?text=Image"
              alt="Placeholder"
            />
          )}
          <div className="grid grid-cols-4 gap-2 -mt-6">
            <div className="col-span-3">
              <input
                ref={inputRef}
                type="text"
                value={caption && caption}
                placeholder={caption ? "" : "Write caption here"}
                onChange={handleCaption}
                className="input input-bordered w-full"
              />
            </div>
            <CldUploadWidget
              uploadPreset="dtskghsx"
              onSuccess={handleUploadSuccess}
            >
              {({ open }) => (
                <button
                  onClick={open}
                  className="btn btn-outline btn-ghost col-span-1"
                >
                  {src ? "Change Image" : "Upload an Image"}
                </button>
              )}
            </CldUploadWidget>
          </div>
        </div>
      );
    };

    root.render(<ImageComponent initialData={this.data} />);

    return wrapper;
  }

  save(blockContent) {
    return {
      src: this.data.src,
      caption: this.data.caption,
    };
  }
}

export default Image;
