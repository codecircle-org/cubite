// {"id":"wE4uH__Nmr","data":{"youtubeId":"UB50Zfb7HuM"},"type":"youtube"}

import React from "react";

interface Props {
  youtubeId: string;
}

const EditorYoutube = ({ youtubeId }: Props) => {
  return (
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
  );
};

export default EditorYoutube;
