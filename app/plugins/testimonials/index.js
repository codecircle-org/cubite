import { createRoot } from "react-dom/client";
import React, { useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { parseMarkdown } from "../../utils/markdownParser";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { User } from "lucide-react";

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

class Testimonials {
  static get toolbox() {
    return {
      title: "Testimonials",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle-code"><path d="M10 9.5 8 12l2 2.5"/><path d="m14 9.5 2 2.5-2 2.5"/><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/></svg>',
    };
  }

  constructor({ data, config }) {
    this.data = data || {
      title: "Our Testimonials",
      description: "Here are our testimonials",
      layoutStyle: "2Columns",
      hasBackgroundColour: false,
      showAsCarousel: false,
      testimonials: [],
    };
    this.siteId = config.siteId;
    this.siteThemeName = config.siteThemeName;
  }

  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const TestimonialsComponent = ({ initialData }) => {
      const [title, setTitle] = useState(
        initialData.title || "A better way to ship your projects"
      );
      const [description, setDescription] = useState(
        initialData.description ||
          "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua. Anim aute id magna aliqua ad ad non deserunt sunt."
      );
      const [hasBackgroundColour, setHasBackgroundColour] = useState(
        initialData.hasBackgroundColour || false
      );
      const [layoutStyle, setLayoutStyle] = useState(
        initialData.layoutStyle || "2 columns"
      );
      const [testimonials, setTestimonials] = useState(
        initialData.testimonials || []
      );
      const [showAsCarousel, setShowAsCarousel] = useState(
        initialData.showAsCarousel || false
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

      const handleHasBackgroundColourChange = (e) => {
        setHasBackgroundColour(e.target.checked);
        this.data.hasBackgroundColour = e.target.checked;
      };

      const handleShowAsCarouselChange = (e) => {
        setShowAsCarousel(e.target.checked);
        this.data.showAsCarousel = e.target.checked;
      };

      const handleLayoutStyleChange = (e) => {
        setLayoutStyle(e.target.value);
        this.data.layoutStyle = e.target.value;
      };

      const handleTestimonialsChange = (index) => {
        return (e) => {
          const newTestimonials = [...testimonials];
          newTestimonials[index][e.target.name] = e.target.value;
          setTestimonials(newTestimonials);
          this.data.testimonials = newTestimonials;
        };
      };

      const addTestimonial = () => {
        setTestimonials([
          ...testimonials,
          {
            highlight: "",
            authorName: "",
            authorDescription: "",
            authorImage: "",
            body: "",
            answer: "",
            youtubeVideoId: "",
          },
        ]);
        this.data.testimonials = [
          ...testimonials,
          {
            highlight: "",
            authorName: "",
            authorTitle: "",
            authorDescription: "",
            authorImage: "",
            body: "",
            answer: "",
            youtubeVideoId: "",
          },
        ];
      };

      const removeTestimonial = (index) => {
        setTestimonials(testimonials.filter((testimonial, i) => i !== index));
        this.data.testimonials = testimonials.filter(
          (testimonial, i) => i !== index
        );
      };

      return (
        <div
          role="tablist"
          className="tabs tabs-lifted my-4"
          data-theme={this.siteThemeName}
        >
          <input
            type="radio"
            name={`testimonials-${tabId}`}
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
              className={`relative col-span-full mx-auto max-w-7xl gap-4 p-8 ${
                hasBackgroundColour ? "bg-base-200/80" : ""
              }`}
            >
              <p className="text-5xl font-bold mb-4">{parseMarkdown(title)}</p>
              <p className="mb-6 antialiased tracking-wide">
                {parseMarkdown(description)}
              </p>
              {showAsCarousel ? (
                <div className="carousel w-full gap-4 p-4">
                  {chunk(testimonials, 3).map((group, groupIndex) => (
                    <div key={groupIndex} className="carousel-item w-full">
                      <div className="grid grid-cols-3 gap-4 w-full">
                        {group.map((testimonial, index) => (
                          <div
                            key={index}
                            className={`col-span-1 border-2 border-dashed border-base-300 p-4 ${
                              hasBackgroundColour
                                ? "bg-base-100"
                                : "bg-base-300"
                            }`}
                          >
                            {testimonial.highlight && (
                              <p className="font-bold text-primary text-2xl">
                                {testimonial.highlight}
                              </p>
                            )}
                            {testimonial.youtubeVideoId && (
                              <iframe
                                className="min-w-full rounded-lg"
                                height={200}
                                src={`https://www.youtube.com/embed/${testimonial.youtubeVideoId}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Embedded youtube"
                              />
                            )}
                            <p className="antialiased tracking-wide">
                              {testimonial.body}
                            </p>
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
                                <p className="font-bold">
                                  {testimonial.authorName}
                                </p>
                                {testimonial.authorDescription && (
                                  <p className="font-light text-sm">
                                    {parseMarkdown(
                                      testimonial.authorDescription
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                            {testimonial.answer && (
                              <p className="antialiased tracking-wide border-t-2 border-base-300 pt-4 pl-2 text-sm italic text-base-content/80">
                                {testimonial.answer}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`col-span-1 border-2 border-dashed border-base-300 p-4 ${
                        hasBackgroundColour ? "bg-base-100" : "bg-base-300"
                      }`}
                    >
                      {testimonial.highlight && (
                        <p className="font-bold text-primary text-2xl">
                          {testimonial.highlight}
                        </p>
                      )}
                      {testimonial.youtubeVideoId && (
                        <iframe
                          className="min-w-full rounded-lg"
                          height={200}
                          src={`https://www.youtube.com/embed/${testimonial.youtubeVideoId}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Embedded youtube"
                        />
                      )}
                      <p className="antialiased tracking-wide">
                        {testimonial.body}
                      </p>
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
                      </div>
                      {testimonial.answer && (
                        <p className="antialiased tracking-wide border-t-2 border-base-300 pt-4 pl-2 text-sm italic text-base-content/80">
                          {testimonial.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <input
            type="radio"
            name={`testimonials-${tabId}`}
            role="tab"
            className="tab"
            aria-label="Settings"
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div className="grid grid-flow-col grid-cols-3 gap-4 place-items-center">
              <div className="col-span-1 flex flex-col gap-8">
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
                <select
                  className="select select-bordered w-full max-w-xs justify-self-end col-span-1"
                  value={layoutStyle}
                  onChange={handleLayoutStyleChange}
                >
                  <option disabled value="">
                    Pick a Layout
                  </option>
                  <option value="full">Full Width</option>
                  <option value="2Columns">2 Columns</option>
                </select>
                <div className="form-control col-span-1">
                  <label className="label cursor-pointer gap-2">
                    <span className="label-text">Has Background Color</span>
                    <input
                      type="checkbox"
                      defaultChecked={hasBackgroundColour}
                      className="checkbox"
                      onChange={handleHasBackgroundColourChange}
                    />
                  </label>
                </div>
                <div className="form-control col-span-1">
                  <label className="label cursor-pointer gap-2">
                    <span className="label-text">Show as Carousel</span>
                    <input
                      type="checkbox"
                      defaultChecked={showAsCarousel}
                      className="checkbox"
                      onChange={handleShowAsCarouselChange}
                    />
                  </label>
                </div>
              </div>

              <label className="form-control w-full h-full col-span-2 row-span-3">
                <div className="label">
                  <span className="label-text">Description</span>
                </div>
                <textarea
                  type="text"
                  placeholder={this.data.description}
                  className="textarea textarea-bordered w-full h-full"
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </label>
            </div>
            <div className="my-8">
              <span className="font-bold text-lg">Testimonials</span>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 my-4 p-4 border border-dashed border-base-300 items-center"
                >
                  <div className="col-span-1">
                    <CldUploadWidget
                      uploadPreset="dtskghsx"
                      onSuccess={(results, options) => {
                        handleTestimonialsChange(index)({
                          target: {
                            name: "authorImage",
                            value: results.info?.public_id,
                          },
                        });
                      }}
                    >
                      {({ open }) => (
                        <div className="">
                          {testimonial.authorImage ? (
                            <div className="avatar">
                              <div className="w-24 h-24 rounded-xl">
                                <CldImage
                                  width={150}
                                  height={150}
                                  className="rounded-full !m-0"
                                  src={testimonial.authorImage}
                                  sizes="100vw"
                                  alt={testimonial.authorName}
                                />
                              </div>
                            </div>
                          ) : (
                            <User
                              className="w-16 h-16 object-cover"
                              onClick={open}
                            />
                          )}
                        </div>
                      )}
                    </CldUploadWidget>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder={testimonial.highlight || "Highlight"}
                      name="highlight"
                      value={testimonial.highlight}
                      className="input input-bordered w-full"
                      onChange={handleTestimonialsChange(index)}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder={testimonial.authorName || "Author Name"}
                      name="authorName"
                      value={testimonial.authorName}
                      className="input input-bordered w-full"
                      onChange={handleTestimonialsChange(index)}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder={
                        testimonial.authorDescription || "Author Description"
                      }
                      name="authorDescription"
                      value={testimonial.authorDescription}
                      className="input input-bordered w-full"
                      onChange={handleTestimonialsChange(index)}
                    />
                  </div>
                  <div className="col-span-2 h-full">
                    <textarea
                      type="text"
                      name="body"
                      placeholder={testimonial.body || "Testimonial Body"}
                      className="textarea textarea-bordered w-full h-40"
                      value={testimonial.body}
                      onChange={handleTestimonialsChange(index)}
                    />
                  </div>

                  <div className="col-span-2 h-full">
                    <textarea
                      type="text"
                      name="answer"
                      placeholder={testimonial.answer || "Staff Answer"}
                      className="textarea textarea-bordered w-full h-40"
                      value={testimonial.answer}
                      onChange={handleTestimonialsChange(index)}
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      placeholder={
                        testimonial.youtubeVideoId || "Youtube Video ID"
                      }
                      name="youtubeVideoId"
                      value={testimonial.youtubeVideoId}
                      className="input input-bordered w-full"
                      onChange={handleTestimonialsChange(index)}
                    />
                  </div>

                  <div className="col-span-full">
                    <button
                      className="btn btn-outline btn-sm btn-error"
                      onClick={() => removeTestimonial(index)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addTestimonial}
                className="btn btn-outline btn-sm btn-secondary col-span-full my-4 block"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      );
    };

    root.render(<TestimonialsComponent initialData={this.data} />);

    return wrapper;
  }
  save(blockContent) {
    return {
      title: this.data.title,
      description: this.data.description,
      layoutStyle: this.data.layoutStyle,
      hasBackgroundColour: this.data.hasBackgroundColour,
      showAsCarousel: this.data.showAsCarousel,
      testimonials: this.data.testimonials,
    };
  }
}

export default Testimonials;
