"use client";

import React, { useState, useEffect } from "react";
import getOpenedxUserProgress from "@/app/utils/getOpenedxUserProgress";
import getOpenedxUserInfo from "@/app/utils/getOpenedxUserInfo";
import getOpenedxAccessToken from "@/app/utils/getOpenedxAccessToken";
import getOpenedxContentStructure from "@/app/utils/getOpenedxContentStructure";
import { useSession } from "next-auth/react";
import { Award, CircleDashed } from "lucide-react";
import Link from "next/link";

interface GradedSection {
  sectionTitle: string;
  subsections: {
    title: string;
    earned: number;
    possible: number;
    blockKey: string;
  }[];
}

interface CourseStructure {
  title: string;
  completed: boolean;
  chapters: {
    id: string;
    title: string;
    completed: boolean;
    subsections: {
      id: string;
      title: string;
      completed: boolean;
      url: string;
    }[];
  }[];
}

function Progress({
  params: { domain, courseId },
}: {
  params: { domain: string; courseId: string };
}) {
  const [site, setSite] = useState({});
  const [progress, setProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [course, setCourse] = useState({});
  const [gradedSections, setGradedSections] = useState<GradedSection[]>([]);
  const [courseStructure, setCourseStructure] = useState<CourseStructure>({});
  const { data: session } = useSession();

  const getSiteData = async () => {
    if (!domain) return;
    // pull site data
    const siteResponse = await fetch(
      `/api/getSitePublicData?domainName=${domain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`
    );
    const siteData = await siteResponse.json();
    setSite(siteData.site);
  };
  useEffect(() => {
    getSiteData();
  }, [domain]);

  const getCourseData = async () => {
    if (!courseId) return;
    const courseResponse = await fetch(`/api/course/${courseId}`);
    const courseData = await courseResponse.json();
    setCourse(courseData.course);
  };
  useEffect(() => {
    getCourseData();
  }, [courseId]);

  const getAccessToken = async () => {
    if (!site) return;
    const accessToken = await getOpenedxAccessToken(site);
    setAccessToken(accessToken);
  };

  useEffect(() => {
    getAccessToken();
  }, [site]);

  const getUserInfo = async () => {
    if (!accessToken || !session?.user?.email) return;
    const userInfo = await getOpenedxUserInfo(
      accessToken,
      site,
      session?.user?.email
    );
    setUserInfo(userInfo);
  };

  useEffect(() => {
    getUserInfo();
  }, [accessToken, session?.user?.email]);

  const getUserProgress = async () => {
    if (!accessToken || !userInfo || !course) return;
    const progress = await getOpenedxUserProgress(
      accessToken,
      site,
      userInfo.user_id,
      course.externalId
    );
    const courseStructure = await getOpenedxContentStructure(
      accessToken,
      site.openedxSiteUrl,
      course.externalId,
      session?.user?.email,
      courseId
    );
    setCourseStructure(courseStructure);
    // Process section scores
    const processedSections = progress.section_scores
      .map((section) => {
        const gradedSubsections = section.subsections
          .filter(sub => sub.num_points_possible > 0)
          .map(sub => ({
            title: sub.display_name,
            earned: sub.num_points_earned,
            possible: sub.num_points_possible,
            blockKey: sub.block_key
          }));

        // Only include sections that have graded subsections
        if (gradedSubsections.length > 0) {
          return {
            sectionTitle: section.display_name,
            subsections: gradedSubsections
          };
        }
        return null;
      })
      .filter(Boolean); // Remove null entries

    setGradedSections(processedSections);
    setProgress(progress);
    setIsLoading(false);
  };
  useEffect(() => {
    getUserProgress();
  }, [accessToken, userInfo, course]);

  const gradeClass = (totalGrade: number, passGrade: number) => {
    if (totalGrade >= passGrade) {
      return "text-success";
    } else if (totalGrade >= passGrade / 2) {
      return "text-yellow-400 animate-pulse";
    } else {
      return "text-error animate-pulse";
    }
  };

  const completionIconClass = (completionPercentage: number) => {
    if (completionPercentage > 1.75) {
      return "animate-spin";
    }
  };

  const getCompletionStatus = (completed: boolean) => {
    if (completed) {
      return {
        icon: "✅",
        class: "text-success font-semibold",
        text: "Completed"
      };
    }
    return {
      icon: "⏳",
      class: "text-warning font-semibold animate-spin",
      text: "In Progress"
    };
  };

  return (
    <div className="flex flex-col items-start justify-start w-full mx-2 my-8">
      {isLoading ? (
        <div className="border-dashed border-base-300 rounded-lg my-8 w-full">
          <div className="flex flex-col gap-4">
            <div className="skeleton h-full w-full"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start justify-start w-full gap-8">
          <div className="stats shadow w-full border-2 border-primary outline-2 outline-offset-4">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Award />
              </div>
              <div className="stat-title">Total Grade</div>
              <div className={`stat-value ${gradeClass(progress.course_grade.percent, progress.grading_policy.grade_range.Pass)}`}>{progress.course_grade.percent * 100}%</div>
              <div className="stat-desc">{`${progress.grading_policy.grade_range.Pass * 100}% is required to pass`}</div>
            </div>

            <div className="stat">
              <div className="stat-figure">
                <CircleDashed className={completionIconClass(progress.completion_summary.complete_count / (progress.completion_summary.complete_count + progress.completion_summary.incomplete_count))} />
              </div>
              <div className="stat-title">Completion Percentage</div>
              <div className="stat-value text-primary">{((progress.completion_summary.complete_count / (progress.completion_summary.complete_count + progress.completion_summary.incomplete_count)) * 100).toFixed(1)}%</div>
              <div className="stat-desc w-1/2">You are missing {progress.completion_summary.incomplete_count} green badges to complete the course</div>
            </div>
          </div>

          <div role="tablist" className="tabs tabs-lifted w-full tabs-lg">
            <input type="radio" name="progress_tab" role="tab" className="tab" aria-label="Grades Breakdown" defaultChecked />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Graded Sections</h2>
            <div className="flex flex-col gap-4">
              {gradedSections.map((section, idx) => (
                <div key={idx} className="border border-dashed border-primary rounded-lg p-4">
                  <div className="card-body">
                    <h3 className="card-title">{section.sectionTitle}</h3>
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th>Assignment</th>
                            <th>Score</th>
                            <th>Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.subsections.map((sub, subIdx) => (
                            <tr key={sub.blockKey}>
                              <td><Link className="text-secondary font-semibold hover:text-primary" href={`/course/${courseId}/learning/block/${sub.blockKey}`}>{sub.title}</Link></td>
                              <td>{`${sub.earned}/${sub.possible}`}</td>
                              <td>
                                <div className="flex items-center gap-2">
                                  <progress 
                                    className="progress progress-primary w-24" 
                                    value={sub.earned} 
                                    max={sub.possible}
                                  />
                                  <span>
                                    {((sub.earned / sub.possible) * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
            </div>

            <input
              type="radio"
              name="progress_tab"
              role="tab"
              className="tab"
              aria-label="Completion History" />
            <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
              <div className="w-full">
                <h2 className="text-2xl font-bold mb-4">Course Completion History</h2>
                <div className="flex flex-col gap-4">
                  {courseStructure.chapters?.map((chapter, idx) => (
                    <div key={chapter.id} 
                      className={`border border-dashed rounded-lg p-4 
                        ${chapter.completed ? 'border-success bg-success/5' : 'border-warning bg-warning/5'}`}
                    >
                      <div className="card-body">
                        <div className="flex items-center justify-between">
                          <h3 className="card-title flex items-center gap-2">
                            {chapter.title}
                            <span className={getCompletionStatus(chapter.completed).class}>
                              {getCompletionStatus(chapter.completed).icon}
                            </span>
                          </h3>
                          <span className={`badge ${chapter.completed ? 'badge-success' : 'badge-warning'}`}>
                            {getCompletionStatus(chapter.completed).text}
                          </span>
                        </div>
                        
                        <div className="overflow-x-auto mt-4">
                          <table className="table w-full">
                            <thead>
                              <tr>
                                <th>Section</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {chapter.subsections.map((subsection) => (
                                <tr key={subsection.id} 
                                  className={subsection.completed ? 'bg-success/5' : 'bg-warning/5'}
                                >
                                  <td className="font-medium">{subsection.title}</td>
                                  <td>
                                    <span className={getCompletionStatus(subsection.completed).class}>
                                      {getCompletionStatus(subsection.completed).icon} {getCompletionStatus(subsection.completed).text}
                                    </span>
                                  </td>
                                  <td>
                                    <Link 
                                      href={subsection.url}
                                      className="btn btn-sm btn-outline btn-primary"
                                    >
                                      {subsection.completed ? 'Review' : 'Start'}
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                      </svg>
                                    </Link>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td colSpan={3} className="text-right text-sm">
                                  {`${chapter.subsections.filter(s => s.completed).length} of ${chapter.subsections.length} completed`}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default Progress;
