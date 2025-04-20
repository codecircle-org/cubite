"use client";

import React, { useState, useEffect } from "react";
import { decryptSecret } from "@/app/utils/secretManager";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { CalendarCheck, Clock } from "lucide-react";
import { CalendarOff } from "lucide-react";
import { GraduationCap } from "lucide-react";
import { Award } from "lucide-react";
import Image from "next/image";
import getOpenedxUserCertificatesByCourse from "@/app/utils/getOpenedxUserCertificatesByCourse";
import getOpenedxContentStructure from "../utils/getOpenedxContentStructure";
import Enrollment from "./Enrollment";
const OpenedxDashboardCourseCard = ({
  enrollment,
  site,
  lastVisitedContent,
}: {
  enrollment: any;
  site: any;
  lastVisitedContent: string;
}) => {
  const session = useSession();
  const [progress, setProgress] = useState(0);
  const [hasExternalEnrollment, setHasExternalEnrollment] = useState(false);
  const [openedxUsername, setOpenedxUsername] = useState("");
  const [openedxUserId, setOpenedxUserId] = useState("");
  const [openedxOutline, setOpenedxOutline] = useState([]);
  const [openedxAccessToken, setOpenedxAccessToken] = useState("");
  const [isProgressLoading, setIsProgressLoading] = useState(true);
  const [doesUserExist, setDoesUserExist] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [firstSubsectionBlockKey, setFirstSubsectionBlockKey] = useState(null);
  const [firstUnitBlockKey, setFirstUnitBlockKey] = useState(null);
  const [units, setUnits] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState({});

  const getOpenedxAccessToken = async () => {
    const formData = new URLSearchParams({
      client_id: decryptSecret(site.openedxOauthClientId),
      client_secret: decryptSecret(site.openedxOauthClientSecret),
      grant_type: "client_credentials",
      token_type: "jwt",
    });

    const accessTokenResponse = await fetch(
      `${site.openedxSiteUrl}/oauth2/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    const accessTokenResponseJson = await accessTokenResponse.json();
    setOpenedxAccessToken(accessTokenResponseJson.access_token);
  };

  const getOpenedxUserInfo = async () => {
    // Return early if no access token is available
    if (!openedxAccessToken) return;

    const encodedEmail = encodeURIComponent(session?.data?.user?.email);
    const requestUrl = `${site.openedxSiteUrl}/cubite/api/v1/get_user_info?email=${encodedEmail}`;

    try {
      const response = await fetch(requestUrl, {
        headers: {
          Authorization: `JWT ${openedxAccessToken}`,
        },
      });
      const result = await response.json();
      if (response.status === 200) {
        setOpenedxUsername(result.username);
        setOpenedxUserId(result.user_id);
        setDoesUserExist(true);
        const certificate = await getOpenedxUserCertificatesByCourse(
          openedxAccessToken,
          site,
          result.username,
          enrollment.course.externalId
        );
        setCertificate(certificate);
      } else if (response.status === 404) {
        setDoesUserExist(false);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const getOpenedxOutline = async () => {
    // Return early if no access token is available and no user id is available
    if (!openedxAccessToken || !openedxUserId) {
      setIsProgressLoading(false);
      return;
    }

    try {
      const requestUrl = `${site.openedxSiteUrl}/api/course_home/v1/progress/${enrollment.course.externalId}/${openedxUserId}`;
      const response = await fetch(requestUrl, {
        headers: {
          Authorization: `JWT ${openedxAccessToken}`,
        },
      });
      const result = await response.json();
      const contentStructure = await getOpenedxContentStructure(
        openedxAccessToken,
        site.openedxSiteUrl,
        enrollment.course.externalId,
        session?.data?.user?.email,
        enrollment.course.id
      );
      const allUnitsIds = contentStructure?.chapters.flatMap(chapter => chapter.subsections.flatMap(subsection => subsection.units.map(unit => unit.id)));
      setUnits(allUnitsIds);
      setFirstUnitBlockKey(contentStructure?.chapters[0].subsections[0].units[0].id);
      setOpenedxOutline(result);
      const totalSection =
        parseInt(result.completion_summary.complete_count) +
        parseInt(result.completion_summary.incomplete_count);
      const completedSection = parseInt(
        result.completion_summary.complete_count
      );
      const progress = (completedSection / totalSection) * 100;
      setProgress(doesUserExist ? Number(progress.toFixed(1)) : 0);
    } catch (error) {
      console.error("Error fetching outline:", error);
    }
    setIsProgressLoading(false);
  };

  const getPaymentStatus = async () => {
    const response = await fetch("/api/paymentStatus", {
      method: "POST",
      body: JSON.stringify({ courseId: enrollment.course.id, siteId: site.id, email: session?.data?.user?.email }),
    });
    const paymentStatusResult = await response.json();
    setPaymentStatus(paymentStatusResult.paymentStatus);
  };

  const hasAccessToCourse = (enrollment: any) => {
    if (enrollment.course.price > 0 && enrollment.course.isWaitList) {
      return paymentStatus.status === "paid" && !enrollment.isWaitListed && enrollment.status === "completed";
    } else if (enrollment.course.price > 0 && !enrollment.course.isWaitList) {
      return paymentStatus.status === "paid" && enrollment.status === "completed" ;
    } else if (enrollment.course.isWaitList) {
      return !enrollment.isWaitListed && enrollment.status === "completed";
    }
    return enrollment.status === "completed";
  };

  useEffect(() => {
    getOpenedxAccessToken();
  }, []);

  useEffect(() => {
    // Only call getOpenedxUserInfo if we have both session and token
    if (session?.data?.user?.email && openedxAccessToken) {
      getOpenedxUserInfo();
    }
  }, [session, openedxAccessToken]);

  useEffect(() => {
    // Only call getOpenedxOutline if we have both access token and user id
    if (openedxAccessToken && openedxUserId) {
      getOpenedxOutline();
    }
  }, [openedxAccessToken, openedxUserId, doesUserExist]);

  useEffect(() => {
    if (session?.data?.user?.email && enrollment.course.id && site.id) {
      getPaymentStatus();
    }
  }, [session, enrollment.course.id, site.id]);

  const isEnrollmentExpirated = (enrollment: any) => {
    const enrolledAtDate = new Date(enrollment.enrolledAt);
    const duration = enrollment.course.duration;
    const enrollmentExpiresAt = enrollment.expiresAt ? new Date(enrollment.expiresAt) : null;

    // if there is no duration, then the enrollment is not expired
    if (!duration) {
      return false;
    }

    const expirationDate = enrollmentExpiresAt ? enrollmentExpiresAt : new Date(
      enrolledAtDate.getTime() + duration * 60 * 60 * 1000
    );

    return expirationDate < new Date();
  };
  return (
    <div
      key={enrollment.course.id}
      data-external-course-id={enrollment.course.externalId}
      className="relative divide-y overflow-hidden rounded-md border border-primary/20 my-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[16rem]">
        <div className="col-span-1 relative min-h-[200px] md:min-h-full">
          {enrollment.course.coverImage ? (
            <CldImage
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              src={enrollment.course.coverImage}
              alt={`${enrollment.course.name} cover image`}
              className="relative object-cover"
            />
          ) : enrollment.course.externalImageUrl ? (
            <Image
              height={500}
              width={500}
              sizes="(max-width: 768px) 100vw, 33vw"
              src={enrollment.course.externalImageUrl}
              alt={enrollment.course.name}
              className="relative object-cover w-full h-full"
            />
          ) : (
            <CldImage
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              src="courseCovers/photo-1732119988788-a4c6840b2ccb_zjllwa"
              alt={`${enrollment.course.name} cover image`}
              className="relative object-cover"
            />
          )}
        </div>
        <div className="col-span-1 md:col-span-2 p-4">
          <div className="flex flex-col gap-2">
            {!enrollment.isWaitListed && (
              <div className="absolute top-4 right-4 md:top-6 md:right-6 rounded-full">
                {isProgressLoading ? (
                  <span className="loading loading-ring loading-xs"></span>
                ) : (
                  <div
                    className="radial-progress text-success text-xs"
                    style={{
                      "--value": `${progress}`,
                      "--size": "3rem",
                      "--thickness": "0.2rem",
                    }}
                    role="progressbar"
                  >
                    {progress}%
                  </div>
                )}
              </div>
            )}
            {enrollment.course.banner && (
              <div role="alert" className="alert w-full md:w-2/3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-info h-6 w-6 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>{enrollment.course.banner}</span>
              </div>
            )}

            <p className="text-base md:text-lg font-light mt-4">
              {enrollment.course.name}
            </p>
            <div className="flex flex-wrap gap-x-2 gap-y-4">
              {enrollment.course.startDate && !enrollment.course.isOnDemand && (
                <>
                  <CalendarCheck className="text-secondary" />
                  <span className="text-xs font-extralight self-end">
                    <span className="text-sm px-2 font-bold">
                      {new Date(
                        enrollment.course.startDate
                      ).toLocaleDateString()}
                    </span>
                    Start Date
                  </span>
                </>
              )}
              {enrollment.course.endDate && (
                <>
                  <CalendarOff className="text-xs text-error" />
                  <span className="text-xs font-extralight self-end">
                    <span className="text-sm px-2 font-bold">
                      {new Date(enrollment.course.endDate).toLocaleDateString()}
                    </span>
                    End Date
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-4">
              {certificate ? (
                <div className="flex flex-row gap-x-2">
                  <Award className="text-xs" />
                  <Link
                    href={`${site.openedxSiteUrl}${certificate.download_url}`}
                    className="text-sm self-end hover:font-bold"
                    target="_blank"
                  >
                    View Certificate
                  </Link>
                </div>
              ) : (
                openedxOutline?.grading_policy?.grade_range?.Pass && (
                  <div className="flex items-center gap-4 my-4">
                    <GraduationCap className="h-8 w-8" />
                    <div className="flex flex-col gap-2">
                      {!enrollment.isWaitListed && (
                        <div className="text-xs">
                          <span className="font-semibold text-sm pr-2">
                            {(
                              openedxOutline.course_grade.percent * 100
                            ).toFixed(1)}
                            %
                          </span>{" "}
                          Your current grade
                        </div>
                      )}
                      <div className="text-xs">
                        <span className="font-semibold text-sm pr-2">
                          {(
                            openedxOutline.grading_policy.grade_range.Pass * 100
                          ).toFixed(1)}
                          %
                        </span>{" "}
                        is required to pass
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
            {session.data?.user?.administratedSites?.includes(site.id) ? (
              <Link
                href={`/course/${enrollment.course.id}/learning/${
                  lastVisitedContent
                    ? `block/${lastVisitedContent}`
                    : `block/${firstUnitBlockKey}`
                }`}
                className="btn btn-primary flex-none w-full md:w-40 justify-self-end md:self-end mt-4"
              >
                {lastVisitedContent
                  ? "Resume - Admin"
                  : "Start - Admin"}
              </Link>
            ) : (
              (hasAccessToCourse(enrollment) && !isEnrollmentExpirated(enrollment)) && (new Date(enrollment.course.startDate) <= new Date() || enrollment.course.isOnDemand) ? (
                <Link
                  href={`/course/${enrollment.course.id}/learning/${
                    lastVisitedContent && units.includes(lastVisitedContent)
                      ? `block/${lastVisitedContent}`
                      : `block/${firstUnitBlockKey}`
                  }`}
                  className="btn btn-primary flex-none w-full md:w-40 justify-self-end md:self-end mt-4"
                >
                  {lastVisitedContent ? "Resume Course" : "Start Course"}
                </Link>
              ) : (
                  <Enrollment
                    courseId={enrollment.course.id}
                    siteId={site.id}
                    course={enrollment.course}
                    site={site}
                  />
                
              )
            )}
          </div>
        </div>
      </div>
      {enrollment.course.duration && (
        <div className="flex flex-row bg-warning/50 py-2">
          <span className="text-xs font-extralight self-end">
            <span className="text-sm px-2 font-bold">
              {!isEnrollmentExpirated(enrollment) ? (
                <>
                  {(() => {
                    const enrolledAtDate = new Date(enrollment.enrolledAt);
                    const expiresAt = enrollment.expiresAt ? new Date(enrollment.expiresAt) : null;
                    const duration = enrollment.course.duration;
                    const expirationDate = expiresAt ? expiresAt : new Date(
                      enrolledAtDate.getTime() + duration * 60 * 60 * 1000
                    );

                    // Get remaining time in hours
                    const remainingMs = expirationDate.getTime() - new Date().getTime();
                    const remainingHours = Math.floor(remainingMs / (60 * 60 * 1000));
                    
                    if (remainingHours < 24) {
                      // For anything less than 24 hours, show hours and minutes
                      const totalMinutes = Math.floor(remainingMs / (60 * 1000));
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      
                      if (hours === 0) {
                        // Less than an hour
                        return `You have ${minutes} ${
                          minutes === 1 ? "minute" : "minutes"
                        } left`;
                      } else {
                        // Between 1 and 23 hours
                        return `You have ${hours} ${hours === 1 ? "hour" : "hours"}${
                          minutes > 0
                            ? ` and ${minutes} ${minutes === 1 ? "minute" : "minutes"}`
                            : ""
                        } left`;
                      }
                    } else {
                      const days = Math.floor(remainingHours / 24);
                      const hours = remainingHours % 24;
                      return `You have ${days} ${days === 1 ? "day" : "days"}${
                        hours > 0
                          ? ` and ${hours} ${hours === 1 ? "hour" : "hours"}`
                          : ""
                      } left`;
                    }
                  })()}
                </>
              ) : (
                <>Your enrollment has expired</>
              )}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default OpenedxDashboardCourseCard;
