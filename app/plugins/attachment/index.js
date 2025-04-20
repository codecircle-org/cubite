import { createRoot } from "react-dom/client";
import React, { useState } from "react";
import { parseMarkdown } from "../../utils/markdownParser";
import { uploadFile } from "@/app/utils/uploadFile";
import Link from "next/link";
import { Code, File, Image, Video, FileAudio, Paperclip } from "lucide-react";
import toast from "react-hot-toast";
class Attachment {
  static get toolbox() {
    return {
      title: "Attachment",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-paperclip"><path d="M13.234 20.252 21 12.3"/><path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"/></svg>',
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

    const AttachmentComponent = ({ initialData }) => {
      const [tabId] = useState(Math.floor(Math.random() * 10000));
      const [fileName, setFileName] = useState(
        initialData.fileName || "No file selected"
      );
      const [fileType, setFileType] = useState(initialData.fileType || null);
      const [fileUrl, setFileUrl] = useState(
        initialData.fileUrl ||
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      );
      const [isLoading, setIsLoading] = useState(false);
      const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setIsLoading(true);
        const fileUrl = await uploadFile(file, file.name, "application/binary");
        setFileName(file.name);
        setFileUrl(fileUrl);
        this.data.fileUrl = fileUrl;
        this.data.fileName = file.name;
        this.data.fileType = file.type;
        toast.success("File uploaded successfully");
        setIsLoading(false);
      };

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
              <Link
                href={fileUrl}
                target="_blank"
                className="btn btn-outline btn-primary !no-underline"
              >
                {fileType === "image" ? (
                  <Image />
                ) : fileType === "video" ? (
                  <Video />
                ) : fileType === "audio" ? (
                  <FileAudio />
                ) : fileType === "code" ? (
                  <Code />
                ) : fileType === "pdf" ? (
                  <File />
                ) : (
                  <Paperclip />
                )}
                {fileName}
              </Link>
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
            <div className="grid grid-flow-col grid-cols-3 gap-4 place-items-start">
              {isLoading ? (
                <span className="loading loading-dots loading-md"></span>
              ) : (
                <>
                  <select
                    className="select select-bordered w-full max-w-xs justify-self-end col-span-1"
                    onChange={(e) => {
                      setFileType(e.target.value);
                      this.data.fileType = e.target.value;
                    }}
                    defaultValue={fileType}
                  >
                    <option disabled value="">
                      File Type
                    </option>
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                    <option value="pdf">PDF</option>
                    <option value="audio">Audio</option>
                    <option value="code">Code</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="col-span-2">
                    <input
                      type="file"
                      className="file-input file-input-bordered w-full max-w-full"
                      onChange={handleFileChange}
                    />
                    <div className="label">
                      <Link
                        href={fileUrl}
                        target="_blank"
                        className="decoration-none"
                      >
                        <span className="label-text-alt">{fileName}</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      );
    };

    root.render(<AttachmentComponent initialData={this.data} />);

    return wrapper;
  }
  save(blockContent) {
    return {
      title: this.data.title,
      fileName: this.data.fileName,
      fileUrl: this.data.fileUrl,
      fileType: this.data.fileType,
    };
  }
}

export default Attachment;
