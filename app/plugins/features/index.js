import { createRoot } from "react-dom/client";
import React, { useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Users,
  Clipboard,
  GraduationCap,
  Monitor,
  BrainCircuit,
  Trophy,
  UserCheck,
  Code,
  Laptop,
  Terminal,
  Lightbulb,
  Route,
  ListCheck,
} from "lucide-react";
import { parseMarkdown } from "../../utils/markdownParser";
import Link from "next/link";
class Features {
  static get toolbox() {
    return {
      title: "Features",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list"><path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/></svg>',
    };
  }

  constructor({ data, config }) {
    this.data = data || {
      title: "Our Features",
      description: "Here are our features",
      layoutStyle: "2Columns",
      hasBackgroundColour: false,
      features: [],
    };
    this.siteId = config.siteId;
    this.siteThemeName = config.siteThemeName;
  }

  render() {
    const wrapper = document.createElement("div");
    const root = createRoot(wrapper);

    const FeaturesComponent = ({ initialData }) => {
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
      const [features, setFeatures] = useState(initialData.features || []);
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

      const handleLayoutStyleChange = (e) => {
        setLayoutStyle(e.target.value);
        this.data.layoutStyle = e.target.value;
      };

      const handleFeaturesChange = (index) => {
        return (e) => {
          const newFeatures = [...features];
          newFeatures[index][e.target.name] = e.target.value;
          setFeatures(newFeatures);
          this.data.features = newFeatures;
        };
      };

      const addFeature = () => {
        setFeatures([
          ...features,
          {
            title: "",
            description: "",
            buttonText: "",
            buttonUrl: "",
            icon: "",
          },
        ]);
        this.data.features = [
          ...features,
          {
            title: "",
            description: "",
            buttonText: "",
            buttonUrl: "",
            icon: "",
          },
        ];
      };

      const removeFeature = (index) => {
        setFeatures(features.filter((feature, i) => i !== index));
        this.data.features = features.filter((feature, i) => i !== index);
      };

      return (
        <div
          role="tablist"
          className="tabs tabs-lifted my-4"
          data-theme={this.siteThemeName}
        >
          <input
            type="radio"
            name={`features-${tabId}`}
            role="tab"
            className="tab"
            aria-label="Preview"
            defaultChecked
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <div className="relative col-span-full mx-auto max-w-7xl gap-4 p-8">
              <p className="text-5xl font-bold mb-4">{parseMarkdown(title)}</p>
              <p className="mb-6 antialiased tracking-wide">
                {parseMarkdown(description)}
              </p>
              <div className="grid grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`lg:col-span-1 col-span-full flex flex-col items-start border-dashed gap-y-8 border-2 border-base-300 p-4 px-8 flex-none h-full ${
                      hasBackgroundColour ? "bg-base-100" : " bg-base-300"
                    }`}
                  >
                    {feature.icon && (
                      <span className="text-primary">
                        {feature.icon === "Users" && (
                          <Users color="currentColor" className="h-10 w-10" />
                        )}
                        {feature.icon === "Clipboard" && (
                          <Clipboard
                            color="currentColor"
                            className="h-10 w-10"
                          />
                        )}
                        {feature.icon === "GraduationCap" && (
                          <GraduationCap
                            color="currentColor"
                            className="h-10 w-10"
                          />
                        )}
                        {feature.icon === "Monitor" && (
                          <Monitor color="currentColor" className="h-10 w-10" />
                        )}
                        {feature.icon === "BrainCircuit" && (
                          <BrainCircuit
                            color="currentColor"
                            className="h-10 w-10"
                          />
                        )}
                        {feature.icon === "Trophy" && (
                          <Trophy color="currentColor" className="h-10 w-10" />
                        )}
                        {feature.icon === "UserCheck" && (
                          <UserCheck
                            color="currentColor"
                            className="h-10 w-10"
                          />
                        )}
                        {feature.icon === "Code" && (
                          <Code color="currentColor" className="h-10 w-10" />
                        )}
                        {feature.icon === "Laptop" && (
                          <Laptop color="currentColor" className="h-10 w-10" />
                        )}
                        {feature.icon === "Terminal" && (
                          <Terminal
                            color="currentColor"
                            className="h-10 w-10"
                          />
                        )}
                        {feature.icon === "Lightbulb" && (
                          <Lightbulb
                            color="currentColor"
                            className="h-10 w-10"
                          />
                        )}
                        {feature.icon === "Route" && (
                          <Route color="currentColor" className="h-10 w-10" />
                        )}
                        {feature.icon === "ListCheck" && (
                          <ListCheck color="currentColor" className="h-10 w-10" />
                        )}
                      </span>
                    )}
                    <p className="text-2xl font-bold">
                      {parseMarkdown(feature.title)}
                    </p>
                    <p className="text-base">
                      {parseMarkdown(feature.description)}
                    </p>
                    {feature.buttonUrl && feature.buttonText && (
                      <Link
                        href={feature.buttonUrl}
                        className="btn btn-secondary !no-underline px-8"
                      >
                        {feature.buttonText}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <input
            type="radio"
            name={`features-${tabId}`}
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
              <label className="form-control w-full col-span-2">
                <div className="label">
                  <span className="label-text">Description</span>
                </div>
                <input
                  type="text"
                  placeholder={this.data.description}
                  className="input input-bordered w-full"
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </label>
              <select
                className="select select-bordered w-full max-w-xs"
                value={layoutStyle}
                onChange={handleLayoutStyleChange}
              >
                <option disabled value="">
                  Pick a Layout
                </option>
                <option value="full">Full Width</option>
                <option value="2Columns">2 Columns</option>
              </select>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Has Background Color</span>
                  <input
                    type="checkbox"
                    defaultChecked={hasBackgroundColour}
                    className="checkbox"
                    onChange={handleHasBackgroundColourChange}
                  />
                </label>
              </div>
            </div>
            <div className="my-8">
              <span className="font-bold text-lg">Features</span>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 my-4 p-4 border border-dashed border-base-300"
                >
                  <div className="col-span-1">
                    <input
                      type="text"
                      placeholder={feature.title || "Feature Title"}
                      name="title"
                      value={feature.title}
                      className="input input-bordered w-full max-w-xs"
                      onChange={handleFeaturesChange(index)}
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="text"
                      name="description"
                      placeholder={feature.description || "Feature Description"}
                      className="input input-bordered w-full max-w-xs"
                      value={feature.description}
                      onChange={handleFeaturesChange(index)}
                    />
                  </div>
                  <div className="col-span-1">
                    <select
                      className="select select-bordered"
                      value={feature.icon}
                      name="icon"
                      onChange={handleFeaturesChange(index)}
                    >
                      <option disabled value="">
                        Pick an Icon
                      </option>
                      <option value="Users">Users</option>
                      <option value="Clipboard">Clipboard</option>
                      <option value="GraduationCap">Graduation Cap</option>
                      <option value="Monitor">Monitor</option>
                      <option value="BrainCircuit">Brain Circuit</option>
                      <option value="Trophy">Trophy</option>
                      <option value="UserCheck">User Check</option>
                      <option value="Code">Code</option>
                      <option value="Laptop">Laptop</option>
                      <option value="Terminal">Terminal</option>
                      <option value="Lightbulb">Lightbulb</option>
                      <option value="Route">Route</option>
                      <option value="ListCheck">List Check</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <input
                      type="text"
                      placeholder={feature.buttonText || "Feature Button Text"}
                      className="input input-bordered w-full max-w-xs"
                      name="buttonText"
                      value={feature.buttonText}
                      onChange={handleFeaturesChange(index)}
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="text"
                      placeholder={feature.buttonUrl || "Feature Button URL"}
                      className="input input-bordered w-full max-w-xs"
                      name="buttonUrl"
                      value={feature.buttonUrl}
                      onChange={handleFeaturesChange(index)}
                    />
                  </div>
                  <div className="col-span-full">
                    <button
                      className="btn btn-outline btn-sm btn-error"
                      onClick={() => removeFeature(index)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addFeature}
                className="btn btn-outline btn-sm btn-secondary col-span-full my-4 block"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      );
    };

    root.render(<FeaturesComponent initialData={this.data} />);

    return wrapper;
  }
  save(blockContent) {
    return {
      title: this.data.title,
      description: this.data.description,
      layoutStyle: this.data.layoutStyle,
      hasBackgroundColour: this.data.hasBackgroundColour,
      features: this.data.features,
    };
  }
}

export default Features;
