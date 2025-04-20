import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { toast } from "react-hot-toast";

class Scratch {
  static get toolbox() {
    return {
      title: "Scratch",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="95.179" height="100.042" viewBox=".321 .3 95.179 100.042"><g fill-rule="evenodd"><path d="M21.9 73.8c-2.4-.5-5.3-1.3-7.7-3.5-5.5-4.9-7.2-13-11-10.9-3.9 2.1-3.8 15.2 8.4 19.2 4.2 1.4 8 1.4 11.1 1.3.8 0 7.7-.7 10.1-4.1 2.4-3.4.7-4.3-.1-4.7-.9-.5-7.4 3.3-10.8 2.7z" stroke="#001026" stroke-width="1.2" fill="#FFAB19" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.8 59.6c-2 .6-3 4.8-2 8.3 1 3.5 2.6 5.3 3.9 6.6-.2-.7-.6-2.9 1.1-4.2 2.1-1.7 5.8-.8 5.8-.8S9.5 65.7 7.9 63c-1.6-2.3-2.1-3.8-4.1-3.4z" fill="#FFF"/><path d="M37.7 81.5c-1.8 1.2-8 5.6-15.9 8.1l-.4.1c-.4.1-.6.6-.4 1 1.7 2.4 4.8 7.2-.7 8.9-5.3 1.7-15.2-12.4-11-16.1 1.9-1.4 3.6-.7 4.5-.3.5.2 1 .2 1.5.1 1.2-.4 3.4-1.2 5.1-2.1 4.3-2.2 5.3-3.1 7.3-4.6 2-1.5 6.6-5.2 10.3-2 3.2 2.7 1.4 5.7-.3 6.9zM53.6 60.7c.5.4 6.6 7.6 8.6 5.8 2.4-2.1 5.7-6.2 9.3-2.9 3.6 3.3-3.2 8.9-6.1 10.4-6.9 3.1-12.5-2.8-13.7-4.4-1.2-1.6-3.3-4.3-3.3-6.9.1-2.8 3.5-3.5 5.2-2z" stroke="#001026" stroke-width="1.2" fill="#FFAB19" stroke-linecap="round" stroke-linejoin="round"/><path d="M46.2 76.7c1.2-.9 2.4-2.4 4-4.7 1.3-1.9 2.7-5.6 2.7-5.6.9-2.5 1.5-7.3-1.8-7.2-2.2.1-4.2-.2-7.6-.7-6-1.2-7.1-2-9.6 2.1-2.7 4.8-9.6 8.3-1.1 16.6 0 0 4.9 3.8 10.8 9.6 4 3.9 10.3 9.5 12.5 11.4.5.4 1.1.6 1.7.7 9.7.9 16.9-.1 16.9-4.4 0-7.2-14.3-4.7-14.3-4.7s-4.6-3.9-6.7-5.8l-7.5-7.3z" stroke="#001026" stroke-width="1.2" fill="#FFAB19" stroke-linecap="round" stroke-linejoin="round"/><path d="M50.6 70s1.9-2.5-2.4-5.2c-4.5-2.9-6.2.3-8 2.7-2 3.1 0 4.6 2 6.4 1.6 1.5 3.1 2.7 3.1 2.7s3.1-2.1 5.3-6.6z" fill="#FFF"/><path d="M30.2 68.4c2.2 2.8 5.6 6.3 1.3 9.2-5.9 3.3-10.8-6.7-11.8-10.2-.9-3.1 1.7-5.1 3.9-6.8 4.3-3.1 7.9-5.9 11.9-4.4 5 1.8 1.4 5.8-1.1 7.6-1.5 1.1-3 2.3-4.1 3-.3.5-.4 1.1-.1 1.6z" stroke="#001026" stroke-width="1.2" fill="#FFAB19" stroke-linecap="round" stroke-linejoin="round"/><g><path d="M53.1 9c-2.3-.4-4.7-.6-7.5-.4-4.7.2-9.2 1.9-9.2 1.9L24.3 2.6c-.4-.2-.9.1-.8.5L25.6 21c.6-.8-10.6 12.8-3.5 24.2 7.1 11.4 22.2 16.5 41 12.8 18.8-3.7 23.2-14.5 22-20.2-1.2-5.7-8.3-7.8-8.3-7.8s-.1-4.5-3.3-10c-1.9-3.3-8.3-8-8.3-8L62.6 1.3c-.1-.4-.6-.5-.9-.3l-8.6 8z" stroke="#001026" stroke-width="1.2" fill="#FFAB19"/><path d="M76.5 30.4s6.9 1.8 8.1 7.5c1.2 5.7-3.6 16-22.2 19.6-24.2 5-35.7-9.4-29-20 6.7-10.7 18.2-1.6 26.6-2.2 7.2-.5 8-6.8 16.5-4.9z" fill="#FFF"/><path d="M45 41.1c0-.4.4-.7.8-.6 1.9.7 7.3 2.3 13.3 2.7 5.4.3 8.6 0 10.1-.3.5-.1.9.4.7.9-.9 2.7-4.7 10.2-15.2 9.6-9.1-1-10-7.4-9.7-12.3z" stroke="#001026" stroke-width="1.2" fill="#FFF" stroke-linecap="round" stroke-linejoin="round"/><path d="M83 35.4s7.2-.1 11.9-3.9M83.4 41.3s3.9 1.9 10.2 1.4" stroke="#001026" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M59.6 32.7c2.1 0 4.3.2 4.4.9.1 1.4-1.4 4.2-3 4.3-1.8.2-6-2.3-6-3.9-.1-1.2 2.6-1.3 4.6-1.3z" stroke="#001026" stroke-width="1.2" fill="#001026" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.6 31.2s8.6 2.8 12.1 5.9M15.3 41.2s7.4 1.1 11.7-.6" stroke="#001026" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M71.4 21c2.9 4.5 3 9.6.2 11.4-2.8 1.8-7.4-.3-10.4-4.8-2.9-4.5-3-9.6-.2-11.4 2.8-1.9 7.5.3 10.4 4.8z" stroke="#001026" stroke-width="1.2" fill="#FFF" stroke-linecap="round" stroke-linejoin="round"/><path d="M71 26.7c0 1.1-.8 2-1.8 2s-1.8-.9-1.8-2 .8-2 1.8-2 1.8.9 1.8 2" fill="#001026"/><g><path d="M46.6 23.8c3 4.4 2.8 9.8.1 11.7-3.3 1.9-7.7.5-10.7-3.9-3.1-4.4-3.3-10.1-.2-12.3 3.1-2.3 7.8.1 10.8 4.5z" stroke="#001026" stroke-width="1.2" fill="#FFF" stroke-linecap="round" stroke-linejoin="round"/><path d="M46 29.6c0 1.1-.8 2-1.8 2s-1.8-.9-1.8-2 .8-2 1.8-2c1 .1 1.8.9 1.8 2" fill="#001026"/></g></g></g></svg>',
    };
  }

  constructor({ data, config }) {
    this.data = data || {
        projectId: null,
    };
  }

  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const ScratchComponent = ({ initialData }) => {
        const [projectId, setProjectId] = useState(initialData.projectId || null);
        const [tabId] = useState(Math.floor(Math.random() * 10000));

        const handleProjectIdChange = (e) => {
            setProjectId(e.target.value);
            toast.success("Project Synced with Scratch");
            this.data.projectId = e.target.value;
        };

        return (
            <div role="tablist" className="tabs tabs-lifted" data-theme={this.siteThemeName}>
                <input type="radio" name={`scratch-${tabId}`} role="tab" className="tab" aria-label="Preview" defaultChecked />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                    <iframe 
                        src={`https://scratch.mit.edu/projects/${projectId}/embed`} 
                        width="100%" 
                        height="800px"
                        allow="autoplay"
                        allowTransparency={true}
                        allowFullScreen
                    ></iframe>
                </div>
                <input
                    type="radio"
                    name={`scratch-${tabId}`}
                    role="tab"
                    className="tab"
                    aria-label="Settings"
                />
                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                    <div className="grid grid-cols-3 gap-4">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Project ID</span>
                            </div>
                            <input type="text" placeholder={this.data.projectId} className="input input-bordered w-full max-w-xs" value={projectId} onChange={handleProjectIdChange} />
                        </label>
                    </div>
                </div>
            </div>
        )
    };

    root.render(<ScratchComponent initialData={this.data} />);
    return wrapper;
  }

  save(blockContent) {
    return {
      projectId: this.data.projectId,
    };
  }
}

export default Scratch;
