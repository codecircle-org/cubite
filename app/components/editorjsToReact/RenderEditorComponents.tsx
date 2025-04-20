import EditorHeader from "./EditorHeader";
import EditorParagraph from "./EditorParagraph";
import EditorList from "./EditorList";
import EditorTable from "./EditorTable";
import EditorChecklist from "./EditorChecklist";
import EditorAlert from "./EditorAlert";
import EditorQuote from "./EditorQuote";
import EditorImage from "./EditorImage";
import EditorHero from "./EditorHero";
import EditorFeatures from "./EditorFeatures";
import EditorTestimonials from "./EditorTestimonials";
import EditorEmailSubscription from "./EditorEmailSubscription";
import EditorCallToAction from "./EditorCallToAction";
import EditorYoutube from "./EditorYoutube";
import CtaRender from "@/app/components/CtaRender";
import CourseCard from "@/app/components/CourseCard";
import EditorColumns from "./EditorColumns";
import Link from "next/link";
import EditorCodeEditor from "./EditorCodeEditor";
import EditorMultipleChoice from "./EditorMultipleChoice";
import EditorCheckbox from "./EditorCheckbox";

import { FileAudio, Video, Image, File, Code, Paperclip } from "lucide-react";

export default function RenderEditorComponents({ blocks, site }: { blocks: any, site: any }) {
  return (
    blocks.map((block) => {
        if (block.type === "header") {
          return (
            <EditorHeader
              key={block.id}
              text={block.data.text}
              alignment={block.data.alignment}
              level={block.data.level}
            />
          );
        }
        if (block.type === "paragraph") {
          return (
            <EditorParagraph
              key={block.id}
              text={block.data.text}
              alignment={block.data.alignment}
            />
          );
        }
        if (block.type === "list") {
          return (
            <EditorList
              key={block.id}
              items={block.data.items}
              style={block.data.style}
            />
          );
        }
        if (block.type === "delimiter") {
          return <div className="ce-delimiter cdx-block" key={block.id}></div>;
        }
        if (block.type === "table") {
          return (
            <EditorTable
              key={block.id}
              withHeadings={block.data.withHeadings}
              content={block.data.content}
            />
          );
        }
        if (block.type === "checklist") {
          return (
            <EditorChecklist key={block.id} items={block.data.items} />
          );
        }
        if (block.type === "alert") {
          return (
            <EditorAlert
              key={block.id}
              type={block.data.type}
              align={block.data.align}
              message={block.data.message}
            />
          );
        }
        if (block.type === "quote") {
          return (
            <EditorQuote
              key={block.id}
              text={block.data.text}
              caption={block.data.caption}
              alignment={block.data.alignment}
            />
          );
        }
        if (block.type === "image") {
          return (
            <EditorImage
              key={block.id}
              src={block.data.src}
              caption={block.data.caption}
            />
          );
        }
        if (block.type === "hero") {
          return (
            <EditorHero
              key={block.id}
              data={block.data}
            />
          );
        }
        if (block.type === "features") {
          return (
            <EditorFeatures
              key={block.id}
              data={block.data}
            />
          );
        }
        if (block.type === "testimonials") {
          return (
            <EditorTestimonials
              key={block.id}
              data={block.data}
            />
          );
        }
        if (block.type === "emailSubscription") {
          return (
            <EditorEmailSubscription
              key={block.id}
              data={block.data}
            />
          );
        }
        if (block.type === "callToAction") {
          return (
            <EditorCallToAction
              key={block.id}
              data={block.data}
            />
          );
        }
        if (block.type === "youtube") {
          return (
            <EditorYoutube
              key={block.id}
              youtubeId={block.data.youtubeId}
            />
          );
        }

        if (block.type === "columns") {
          return (
            <EditorColumns
              key={block.id}
              data={block.data}
            />
          );
        }
        if (block.type === "jupyterNotebook") {
          return (
            <div className="my-4">
              <iframe src={block.data.notebookUrl} className="w-full" width="100%" height="800px" />
            </div>
          );
        }
        if (block.type === "wasmEditor") {
          return (
            <EditorCodeEditor
              key={block.id}
              code={block.data.code}
              language={block.data.language}
              editable={block.data.editable}
            />
          );
        }
        if (block.type === "multipleChoice") {
          return (
            <EditorMultipleChoice
              key={block.id}
              data={block.data}
            />
          );
        }
        if (block.type === "checkbox") {
          return (
            <EditorCheckbox
              key={block.id}
              data={block.data}
            />
          );
        }
        if (block.type === "scratch") {
          return (
            <div className="my-4">
              <iframe 
                src={`https://scratch.mit.edu/projects/${block.data.projectId}/embed`} 
                className="w-full" 
                width="100%" 
                height="750px"
                allow="autoplay"
                allowTransparency={true}
                allowFullScreen
              />
              <Link target="_blank" href={`https://scratch.mit.edu/projects/${block.data.projectId}/editor/`} className="text-center font-semibold text-xl block border border-primary-200 rounded-md p-2 hover:bg-primary hover:text-white">
                Open the Editor
              </Link>
            </div>
          );
        }
        if (block.type === "pdfViewer") {
          return (
            <div className="my-4">
              <iframe src={block.data.pdfUrl} className="w-full" width="100%" height="800px" />
            </div>
          );
        }
        if (block.type === "attachment") {
          return (
            <div>
              <Link
                href={block.data.fileUrl}
                target="_blank"
                className="btn btn-outline btn-primary !no-underline"
              >
                {block.data.fileType === "image" ? (
                  <Image />
                ) : block.data.fileType === "video" ? (
                  <Video />
                ) : block.data.fileType === "audio" ? (
                  <FileAudio />
                ) : block.data.fileType === "code" ? (
                  <Code />
                ) : block.data.fileType === "pdf" ? (
                  <File />
                ) : (
                  <Paperclip />
                )}
                {block.data.fileName}
              </Link>
            </div>
          );
        }
        if (block.type === "courses") {
          const visibleCourses = block.data.courses.filter(
            (course) => !course.hide
          );

          const sortedCourses = [...visibleCourses]
            .sort((a, b) => {
              if (block.data.sortBy === "name_asc")
                return a.name.localeCompare(b.name);
              if (block.data.sortBy === "name_desc")
                return b.name.localeCompare(a.name);
              if (block.data.sortBy === "level")
                return (a.level || "").localeCompare(b.level || "");
              if (block.data.sortBy === "start_date")
                return (
                  new Date(a.startDate || 0) - new Date(b.startDate || 0)
                );
              return 0;
            })
            .slice(0, block.data.limitCourses || 3);

          return (
            <div className="max-w-7xl border-t border-primary-200 p-8 py-24" key={block.id}>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl !mt-3 !mb-0">
                {block.data.title}
              </h2>
              <p className="mt-6 text-lg leading-7 w-5/6 mb-8">
                {block.data.description}
              </p>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${block.data.limitCoursesPerLine ? block.data.limitCoursesPerLine : 3} gap-4 my-3`}
              >
                {sortedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} site={site} />
                ))}
              </div>
              <Link
                href={"/courses"}
                className="text-center my-6 font-semibold text-xl block border border-primary-200 rounded-md p-2 hover:bg-primary hover:text-white"
              >
                View All
              </Link>
            </div>
          );
        }
        if (block.type === "cta") {
          return (
            <CtaRender block={block} />
          );
        }
        return null;
    })
  );
}
