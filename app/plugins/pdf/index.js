import { createRoot } from "react-dom/client";
import React, { useState } from "react";
import { parseMarkdown } from "../../utils/markdownParser";
import { uploadFile } from "@/app/utils/uploadFile";
import Link from "next/link";
import toast from "react-hot-toast";

class PDFViewer {
  static get toolbox() {
    return {
      title: "PDF Viewer",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
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

    const PDFViewerComponent = ({ initialData }) => {
      const [tabId] = useState(Math.floor(Math.random() * 10000));
      const [fileName, setFileName] = useState(
        initialData.fileName || "No file selected"
      );
      const [pdfUrl, setPdfUrl] = useState(
        initialData.pdfUrl ||
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
      );
      const [isLoading, setIsLoading] = useState(false);
      const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setIsLoading(true);
        const pdfUrl = await uploadFile(file, file.name, "application/pdf");
        setFileName(file.name);
        setPdfUrl(pdfUrl);
        this.data.pdfUrl = pdfUrl;
        this.data.fileName = file.name;
        this.data.file = file;
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
              <iframe src={pdfUrl} className="w-full h-[800px]" />
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
            <div className="">
              <div className="col-span-full flex flex-col gap-8">
                {isLoading ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  <>
                    <input
                      type="file"
                      placeholder={fileName}
                      accept="application/pdf"
                      className="file-input file-input-bordered w-full max-w-full"
                      onChange={handleFileChange}
                    />
                    <Link
                      href={pdfUrl}
                      target="_blank"
                      className="decoration-none"
                    >
                      <span className="label-text-alt">{fileName}</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

    root.render(<PDFViewerComponent initialData={this.data} />);

    return wrapper;
  }
  save(blockContent) {
    return {
      title: this.data.title,
      fileName: this.data.fileName,
      pdfUrl: this.data.pdfUrl,
    };
  }
}

export default PDFViewer;
