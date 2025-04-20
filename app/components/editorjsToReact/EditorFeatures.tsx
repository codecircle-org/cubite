import Link from "next/link";
import React from "react";
import { parseMarkdown } from "../../utils/markdownParser";
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
  ListCheck
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  buttonUrl: string;
  buttonText: string;
  icon: string;
}

function EditorFeatures({ data }: { data: any }) {
  const { title, description, features, hasBackgroundColour } = data;
  return (
    <div
      className={`relative w-screen -mx-[50vw] left-[50%] right-[50%] grid grid-cols-3 gap-4 p-8 ${
        hasBackgroundColour ? "bg-base-200/80" : ""
      }`}
    >
      <div className="relative z-10 col-span-full mx-auto max-w-7xl gap-4 p-8 py-32">
        <p className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{parseMarkdown(title)}</p>
        <p className="mb-6 antialiased tracking-wide">{parseMarkdown(description)}</p>
        <div className="grid grid-cols-3 gap-4">
          {features.map((feature: Feature, index: number) => (
            <div
              key={index}
              className={
                `lg:col-span-1 col-span-full flex flex-col items-start border-dashed gap-y-8 border-2 border-base-300 py-12 px-8 flex-none h-full ${
                hasBackgroundColour ? "bg-base-100" : " bg-base-300"
              }`}
            >
              {feature.icon && (
                <span className="text-primary">
                  {feature.icon === "Users" && (
                    <Users color="currentColor" className="h-10 w-10" />
                  )}
                  {feature.icon === "Clipboard" && (
                    <Clipboard color="currentColor" className="h-10 w-10" />
                  )}
                  {feature.icon === "GraduationCap" && (
                    <GraduationCap color="currentColor" className="h-10 w-10" />
                  )}
                  {feature.icon === "Monitor" && (
                    <Monitor color="currentColor" className="h-10 w-10" />
                  )}
                  {feature.icon === "BrainCircuit" && (
                    <BrainCircuit color="currentColor" className="h-10 w-10" />
                  )}
                  {feature.icon === "Trophy" && (
                    <Trophy color="currentColor" className="h-10 w-10" />
                  )}
                  {feature.icon === "UserCheck" && (
                    <UserCheck color="currentColor" className="h-10 w-10" />
                  )}
                  {feature.icon === "Code" && (
                    <Code color="currentColor" className="h-10 w-10" />
                  )}
                  {feature.icon === "Laptop" && (
                    <Laptop color="currentColor" className="h-10 w-10" />
                  )}
                  {feature.icon === "Terminal" && (
                    <Terminal color="currentColor" className="h-10 w-10" />
                  )}
                  {feature.icon === "Lightbulb" && (
                    <Lightbulb color="currentColor" className="h-10 w-10" />
                  )}
                  {feature.icon === "Route" && (
                    <Route color="currentColor" className="h-10 w-10" />
                  )}
                  {feature.icon === "ListCheck" && (
                    <ListCheck color="currentColor" className="h-10 w-10" />
                  )}
                </span>
              )}
              <p className="text-2xl font-bold">{parseMarkdown(feature.title)}</p>
              <p className="text-base">{parseMarkdown(feature.description)}</p>
              {
                feature.buttonUrl && feature.buttonText && (
                  <Link
                    href={feature.buttonUrl}
                className="btn btn-primary btn-secondary !no-underline px-8"
              >
                {feature.buttonText}
                  </Link>
                )
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EditorFeatures;
