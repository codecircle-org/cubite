import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

class Youtube {
  static get toolbox() {
    return {
      title: "Youtube",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></svg>',
    };
  }

  constructor({ data }) {
    this.data = data || {};
  }
  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const YoutubeComponent = ({ initialData }) => {
      const [youtubeId, setYoutubeId] = useState(initialData.youtubeId);
      const handleYoutubeId = (e) => {
        setYoutubeId(e.target.value);
        this.data.youtubeId = e.target.value;
      };
      const inputRef = useRef(null);
      useEffect(() => {
        if (inputRef.current && !youtubeId) {
          inputRef.current.focus();
        }
      }, []);
      return (
        <div className="items-center my-4">
          <div className="video-responsive">
            <iframe
              className="min-w-full"
              height={400}
              src={`https://www.youtube.com/embed/${youtubeId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          </div>
          <div className="mt-2">
            <input
              type="text"
              value={youtubeId && youtubeId}
              placeholder={youtubeId ? "" : "Youtube Video ID like LXb3EKWsInQ"}
              onChange={handleYoutubeId}
              className="input input-bordered w-full col-span-3"
              ref={inputRef}
            />
          </div>
        </div>
      );
    };

    root.render(<YoutubeComponent initialData={this.data} />);

    return wrapper;
  }

  save(blockContent) {
    return {
      youtubeId: this.data.youtubeId,
    };
  }
}

export default Youtube;
