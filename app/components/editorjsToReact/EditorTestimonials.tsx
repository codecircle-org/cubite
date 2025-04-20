"use client";

import React, { useState } from "react";
import { parseMarkdown } from "../../utils/markdownParser";
import { CldImage } from "next-cloudinary";
import { User } from "lucide-react";

interface Testimonial {
  highlight: string;
  body: string;
  authorName: string;
  authorDescription: string;
  answer?: string;
  authorImage?: string;
  youtubeVideoId?: string;
}

interface SectionData {
  title: string;
  description: string;
  testimonials: Testimonial[];
  hasBackgroundColour: boolean;
  showAsCarousel: boolean;
}

const chunk = (arr: Testimonial[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

function EditorTestimonials({ data }: { data: SectionData }) {
  const {
    title,
    description,
    testimonials,
    hasBackgroundColour,
    showAsCarousel,
  } = data;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get the number of items per slide based on screen size
  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 640 ? 3 : 1;
    }
    return 1; // Default to 1 for SSR
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(1);

  React.useEffect(() => {
    setItemsPerSlide(getItemsPerSlide());
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Get visible testimonials based on current slide and screen size
  const getVisibleTestimonials = () => {
    const start = currentSlide * itemsPerSlide;
    return testimonials.slice(start, start + itemsPerSlide);
  };

  return (
    <div
      className={`relative w-screen -mx-[50vw] left-[50%] right-[50%] z-10 col-span-full gap-4 p-4 sm:p-8 ${
        hasBackgroundColour ? "bg-base-200/80" : ""
      }`}
    >
      <div className="relative z-10 col-span-full mx-auto max-w-7xl gap-4 p-4 sm:p-8 py-16 sm:py-32">
        <p className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          {parseMarkdown(title)}
        </p>
        <p className="mb-6 antialiased tracking-wide">
          {parseMarkdown(description)}
        </p>

        {showAsCarousel ? (
          <div className="relative px-8 sm:px-12">
            <div className="carousel w-full">
              <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {getVisibleTestimonials().map((testimonial, index) => (
              <div
              key={index}
              className={`col-span-1 border-2 border-dashed border-base-300 p-4 sm:p-6 flex flex-col justify-between gap-4 ${
                hasBackgroundColour ? "bg-base-100" : "bg-base-300"
              }`}
            >
              <div className="space-y-4">
                {testimonial.highlight && (
                  <p className="font-bold text-primary text-2xl">
                    {parseMarkdown(testimonial.highlight)}
                  </p>
                )}
                {testimonial.youtubeVideoId && (
                  <iframe
                    className="min-w-full rounded-sm"
                    height={200}
                    src={`https://www.youtube.com/embed/${testimonial.youtubeVideoId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded youtube"
                  />
                )}
                <p className="antialiased tracking-wide">
                  {parseMarkdown(testimonial.body)}
                </p>
              </div>
              <div className="">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="col-span-1">
                    <div className="avatar">
                      <div className="w-16 h-16 rounded-xl">
                        {testimonial.authorImage ? (
                          <CldImage
                            width={96}
                            height={96}
                            className="rounded-full"
                            src={testimonial.authorImage}
                            alt={testimonial.authorName}
                          />
                        ) : (
                          <User className="w-16 h-16" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="font-bold">{testimonial.authorName}</p>
                    {testimonial.authorDescription && (
                      <p className="font-light text-sm">
                        {parseMarkdown(testimonial.authorDescription)}
                      </p>
                    )}
                  </div>
                  {testimonial.answer && (
                    <div className="col-span-full">
                      <p className="antialiased tracking-wide border-t-2 border-base-300 pt-4 pl-2 text-sm italic text-base-content/80">
                        {parseMarkdown(testimonial.answer)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 transform w-full left-0">
              <div className="flex justify-between">
                <button
                  onClick={handlePrev}
                  className="btn btn-circle -ml-4 sm:-ml-8"
                >
                  ❮
                </button>
                <button
                  onClick={handleNext}
                  className="btn btn-circle -mr-4 sm:-mr-8"
                >
                  ❯
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`col-span-1 border-2 border-dashed border-base-300 p-4 sm:p-6 flex flex-col justify-between gap-4 ${
                  hasBackgroundColour ? "bg-base-100" : "bg-base-300"
                }`}
              >
                <div className="space-y-4">
                  {testimonial.highlight && (
                    <p className="font-bold text-primary text-2xl">
                      {parseMarkdown(testimonial.highlight)}
                    </p>
                  )}
                  {testimonial.youtubeVideoId && (
                    <iframe
                      className="min-w-full rounded-sm"
                      height={200}
                      src={`https://www.youtube.com/embed/${testimonial.youtubeVideoId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Embedded youtube"
                    />
                  )}
                  <p className="antialiased tracking-wide">
                    {parseMarkdown(testimonial.body)}
                  </p>
                </div>
                <div className="">
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="avatar">
                        <div className="w-16 h-16 rounded-xl">
                          {testimonial.authorImage ? (
                            <CldImage
                              width={96}
                              height={96}
                              className="rounded-full"
                              src={testimonial.authorImage}
                              alt={testimonial.authorName}
                            />
                          ) : (
                            <User className="w-16 h-16" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="font-bold">{testimonial.authorName}</p>
                      {testimonial.authorDescription && (
                        <p className="font-light text-sm">
                          {parseMarkdown(testimonial.authorDescription)}
                        </p>
                      )}
                    </div>
                    {testimonial.answer && (
                    <div className="col-span-full">
                      <p className="antialiased tracking-wide border-t-2 border-base-300 pt-4 pl-2 text-sm italic text-base-content/80">
                        {parseMarkdown(testimonial.answer)}
                      </p>
                    </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {showAsCarousel && (
          <div className="flex w-full justify-center gap-2 py-2 mt-4">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`btn btn-xs ${
                  index === currentSlide ? "btn-active" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EditorTestimonials;
