"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  ChevronRight, 
  BadgeCheck, 
  CircleDot, 
  CircleDashed,
  PlayCircle, // for video
  FileText, // for html
  PenLine, // for problem/quiz
  Blocks // default for other types
} from "lucide-react";
import { useSession } from "next-auth/react";
import getOpenedxContentStructure from "@/app/utils/getOpenedxContentStructure";
import { useParams } from "next/navigation";

interface Unit {
  id: string;
  title: string;
  type: string;
  completion: number;
  childBlocks: {
    id: string;
    title: string;
    type: string;
    completion: number;
  }[];
}

interface Subsection {
  id: string;
  title: string;
  url: string;
  completed: boolean;
  units: Unit[];
}

interface Chapter {
  id: string;
  title: string;
  subsections: Subsection[];
}

interface CourseStructure {
  title: string;
  chapters: Chapter[];
}

interface NavigationProps {
  courseStructure: CourseStructure;
  courseId: string;
  siteId: string;
  openedxAccessToken: string;
  openedxUrl: string;
  openedxCourseId: string;
  currentBlockId?: string;
}

export default function Navigation({
  courseStructure,
  courseId,
  siteId,
  openedxAccessToken,
  openedxUrl,
  openedxCourseId,
  currentBlockId,
}: NavigationProps) {
  const [expandedChapters, setExpandedChapters] = useState<{
    [key: string]: boolean;
  }>({});
  const { data: session } = useSession();
  const [lastVisitedContent, setLastVisitedContent] = useState<string | null>(
    null
  );
  const [contentStructure, setContentStructure] = useState(courseStructure);
  const { blockId } = useParams();

  // Add this effect to update contentStructure when courseStructure changes
  useEffect(() => {
    setContentStructure(courseStructure);
  }, [courseStructure]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const getLastVisitedContent = async () => {
    const lastVisitedContentResponse = await fetch(
      `/api/last-visited-content?courseId=${courseId}&siteId=${siteId}`
    );
    const lastVisitedContent = await lastVisitedContentResponse.json();
    setLastVisitedContent(lastVisitedContent.lastVisitedContent);

    // Find and expand the chapter containing the last visited content
    if (lastVisitedContent.lastVisitedContent) {
      const chapterWithLastVisited = courseStructure.chapters.find((chapter) =>
        chapter.subsections.some((subsection) =>
          subsection.units.some(
            (unit) => unit.id === lastVisitedContent.lastVisitedContent
          )
        )
      );
      if (chapterWithLastVisited) {
        setExpandedChapters((prev) => ({
          ...prev,
          [chapterWithLastVisited.id]: true,
        }));
      }
    }
  };

  useEffect(() => {
    getLastVisitedContent();
  }, [courseId, siteId]);

  useEffect(() => {
    if (currentBlockId) {
      const decodedBlockId = decodeURIComponent(currentBlockId);
      
      // Find the chapter containing the current block
      const chapterWithCurrentBlock = courseStructure.chapters.find((chapter) =>
        chapter.subsections.some((subsection) =>
          subsection.units.some((unit) => unit.id === decodedBlockId)
        )
      );

      if (chapterWithCurrentBlock) {
        setExpandedChapters((prev) => ({
          ...prev,
          [chapterWithCurrentBlock.id]: true,
        }));
      }
    }
  }, [currentBlockId, courseStructure.chapters]);

  const handleLastVisitedContent = async (unitId: string) => {
    const lastVisitedContentResponse = await fetch(
      "/api/last-visited-content",
      {
        method: "POST",
        body: JSON.stringify({
          courseId,
          lastVisitedContent: unitId,
          siteId,
        }),
      }
    );
    const lastVisitedContent = await lastVisitedContentResponse.json();
    setLastVisitedContent(lastVisitedContent);
    const contentStructure = await getOpenedxContentStructure(
      openedxAccessToken,
      openedxUrl,
      openedxCourseId,
      session?.user?.email,
      courseId
    );
    if (contentStructure) {
      setContentStructure(contentStructure);
    }
  };

  // Add this helper function to calculate chapter completion percentage
  const getChapterProgress = (chapter: Chapter) => {
    const totalSubsections = chapter.subsections.length;
    const completedSubsections = chapter.subsections.filter(s => s.completed).length;
    return (completedSubsections / totalSubsections) * 100;
  };

  // Add this helper function to get the badge styling based on completion
  const getChapterBadgeStyle = (chapter: Chapter) => {
    const progress = getChapterProgress(chapter);
    
    if (chapter.completed || progress === 100) {
      return "text-success";
    }
    
    // For partially completed chapters with specific steps
    if (progress >= 75) {
      return "text-success/75";
    } else if (progress >= 50) {
      return "text-success/50";
    } else if (progress >= 25) {
      return "text-success/25";
    } else if (progress > 0) {
      return "text-success/10";
    }
    
    return "text-base-300";
  };

  const getChapterIcon = (chapter: Chapter) => {
    const progress = getChapterProgress(chapter);
    
    if (progress === 100) {
      return (
        <div className="tooltip" data-tip="Completed">
          <BadgeCheck className="w-4 h-4 text-success" />
        </div>
      );
    } else if (progress > 0) {
      return (
        <div className="tooltip" data-tip={`${Math.round(progress)}% completed`}>
          <CircleDashed 
            className={`w-4 h-4 ${getChapterBadgeStyle(chapter)}`}
          />
        </div>
      );
    }
    
    // For untouched chapters
    return (
      <div className="tooltip" data-tip="Not started">
        <CircleDot className="w-4 h-4 text-base-300" />
      </div>
    );
  };

  const getUnitIcon = (unit: Unit) => {
    // Check if unit has child blocks
    if (unit.childBlocks && unit.childBlocks.length > 0) {
      // Priority order: problem > video > html > others
      if (unit.childBlocks.some(block => block.type.toLowerCase() === 'problem')) {
        return <PenLine className="w-4 h-4" />;
      }
      if (unit.childBlocks.some(block => block.type.toLowerCase() === 'video')) {
        return <PlayCircle className="w-4 h-4" />;
      }
      if (unit.childBlocks.some(block => block.type.toLowerCase() === 'html')) {
        return <FileText className="w-4 h-4" />;
      }
    }
    
    // Fallback to unit's own type or default icon
    switch (unit.type.toLowerCase()) {
      case 'problem':
        return <PenLine className="w-4 h-4" />;
      case 'video':
        return <PlayCircle className="w-4 h-4" />;
      case 'html':
        return <FileText className="w-4 h-4" />;
      default:
        return <Blocks className="w-4 h-4" />;
    }
  };

  return (
    <nav className="p-4">
      <div className="space-y-2">
        {contentStructure.chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`collapse collapse-arrow border border-dashed border-base-300 bg-base-100 rounded-lg
              ${expandedChapters[chapter.id] ? "collapse-open" : ""}`}
          >
            <input
              type="checkbox"
              checked={expandedChapters[chapter.id]}
              onChange={() => toggleChapter(chapter.id)}
            />
            <div className="collapse-title text-sm font-medium flex items-center justify-between gap-2">
              {chapter.title}
              {getChapterIcon(chapter)}
            </div>
            <div className="collapse-content">
              <div className="flex flex-col gap-1 pl-2">
                {chapter.subsections.map((subsection) => (
                  <div key={subsection.id} className="space-y-1">
                    <div className="p-2 text-sm font-medium flex items-center justify-between">
                        <div className="flex-grow truncate pr-2">
                          {subsection.title}
                        </div>
                        <div className="flex-shrink-0">
                          {subsection.completed && (
                            <BadgeCheck className="w-4 h-4 text-success" />
                          )}
                        </div>
                    </div>
                    <div className="pl-4 space-y-1">
                      {subsection.units.map((unit) => {
                        const isCurrentUnit = currentBlockId && 
                          decodeURIComponent(currentBlockId) === unit.id;
                        
                        return (
                          <Link
                            key={unit.id}
                            href={`/course/${courseId}/learning/block/${unit.id}`}
                            onClick={() => handleLastVisitedContent(unit.id)}
                            className={`p-2 text-sm rounded-md hover:bg-base-200 transition-colors flex items-center gap-2
                              ${
                                isCurrentUnit
                                  ? "bg-base-200 text-primary font-bold"
                                  : "text-base-content font-light"
                              }`}
                          >
                            {getUnitIcon(unit)}
                            <span className="flex-grow">{unit.title}</span>
                            {unit.completion === 1 && (
                              <BadgeCheck className="w-4 h-4 text-success" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
