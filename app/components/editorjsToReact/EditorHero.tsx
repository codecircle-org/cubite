import React from "react";
import Link from "next/link";
import { parseMarkdown } from "../../utils/markdownParser";

interface Props {
  data: any;
}

const EditorHero = ({ data }: Props) => {
  return (
        <div className={`relative w-screen gap-4 p-8 -mx-[50vw] left-[50%] right-[50%] ${data.backgroundImage ? 'bg-cover bg-center' : ''}`} style={data.backgroundImage ? {backgroundImage: `url(https://res.cloudinary.com/dn3cywkpn/image/upload/c_limit,w_2048/f_auto/q_auto/v1/${data.backgroundImage}?_a=BAVCluDW0)`} : {}}>
            {data.backgroundImage && <div className="absolute inset-0 bg-base-200/80"></div>}
            <div className="flex flex-col gap-4 p-8 py-32 relative z-10 col-span-full mx-auto max-w-7xl">
                {data.title && <p className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{parseMarkdown(data.title)}</p>}
                {data.description && <p className="my-4 antialiased tracking-wide lg:w-1/2 w-full text-lg font-medium">{parseMarkdown(data.description)}</p>}
                {data.buttonUrl && data.buttonText && <Link href={data.buttonUrl} className="btn btn-primary !no-underline w-fit mt-4 flex-grow">{data.buttonText}</Link>}
            </div>
        </div>
  )
};

export default EditorHero;
