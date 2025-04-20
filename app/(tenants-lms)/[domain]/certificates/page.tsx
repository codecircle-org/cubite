"use client";

import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import { PartyPopper } from "lucide-react";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import getOpenedxAccessToken from "@/app/utils/getOpenedxAccessToken";
import getOpenedxUserInfo from "@/app/utils/getOpenedxUserInfo";
import getOpenedxUserCertificates from "@/app/utils/getOpenedxUserCertificates";
import { FolderSearch } from "lucide-react";
function CertificatesPage({ params: { domain } }: { params: { domain: string } }) {
  const { data: session } = useSession();
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [site, setSite] = useState(null);
  const [openedxAccessToken, setOpenedxAccessToken] = useState(null);
  const [openedxUserInfo, setOpenedxUserInfo] = useState(null);
  const [openedxUserCertificates, setOpenedxUserCertificates] = useState(null);
  const [isEnrollmentsLoading, setIsEnrollmentsLoading] = useState(true);
  const [isOpenedxCertificatesLoading, setIsOpenedxCertificatesLoading] = useState(true);

  useEffect(() => {
    const getSite = async () => {
      const response = await fetch(`/api/getSitePublicData?domainName=${domain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`);
      const data = await response.json();
      setSite(data.site);
    }
    getSite();

    const getUserEnrollments = async () => {
      const response = await fetch(`/api/enrollments`);
      const data = await response.json();
      setUserEnrollments(data.enrollments);
      setIsEnrollmentsLoading(false);
    };
    getUserEnrollments();
  }, [session]);

  useEffect(() => {
    const getOpenedxCertificates = async () => {
      // Only proceed if we have all required data
      if (!site || !session?.user?.email) {
        return;
      }

      try {
        const accessToken = await getOpenedxAccessToken(site);
        const userInfo = await getOpenedxUserInfo(accessToken, site, session.user.email);
        if (!userInfo?.username) {
          console.log("No username found in userInfo");
          return;
        }

        const userCertificates = await getOpenedxUserCertificates(accessToken, site, userInfo.username);
        setOpenedxUserInfo(userInfo);
        setOpenedxUserCertificates(userCertificates);
      } catch (error) {
        console.error("Error in getOpenedxCertificates:", error);
      } finally {
        setIsOpenedxCertificatesLoading(false);
      }
    }

    if (site?.openedxSiteUrl && session?.user?.email) {
      getOpenedxCertificates();
    }
  }, [session, site]);

  return (
    <div className="mx-12 my-24">
      <p className="text-3xl font-black">Certificates Portal</p>
      <div className="flex flex-col my-12 border-2 border-dashed border-primary/10 rounded-lg p-12">
        {/* Stats */}
        <div className="stats border-2 border-primary outline-2 outline-offset-4">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <BookOpen className="h-8 w-8 text-secondary" />
            </div>
            <div className="stat-title">Enrolled Courses</div>
            <div className="stat-value mt-2">
              {isEnrollmentsLoading ? (
                <span className="loading loading-ring loading-md"></span>
              ) : (
                userEnrollments.length
              )}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <PartyPopper className="h-8 w-8 text-secondary" />
            </div>
            <div className="stat-title">Completed Courses</div>
            <div className="stat-value mt-2">{isOpenedxCertificatesLoading ? (
                <span className="loading loading-ring loading-md"></span>
              ) : (
                openedxUserCertificates?.length
              )}</div>
          </div>
        </div>
        {/* Table of Certificates */}
        <div className="overflow-x-auto my-12 bg-base-200 rounded-lg p-8">
          {isOpenedxCertificatesLoading ? (
            <div className="flex justify-center items-center h-full">
              <span className="loading loading-dots loading-md"></span>
            </div>
          ) : openedxUserCertificates && openedxUserCertificates?.length > 0 ? (
          <table className="table">
            {/* head */}
            <thead>
              <tr className="border-b-2 border-secondary/10">
                <th>Course</th>
                <th>Status</th>
                <th>Issued On</th>
                <th>Grade</th>
                <th>Certificates</th>
              </tr>
            </thead>
            <tbody>
              {openedxUserCertificates.map((certificate: any) => (
              <>
                <tr key={certificate.course_id} className="hover:bg-base-100 border-b-2 border-secondary/10">
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-light">{certificate.course_display_name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="">
                    <span className="badge badge-success text-xs font-light capitalize">
                      {certificate.status}
                    </span>
                  </td>
                  <td>{new Date(certificate.created_date).toLocaleDateString()}</td>
                  <td>{certificate.grade}</td>
                  <th className="flex flex-col gap-2 items-start">
                    <Link
                      href={`${site.openedxSiteUrl}${certificate.download_url}`}
                      className="font-light text-sm hover:underline"
                      target="_blank"
                    >
                      View Certificate
                    </Link>
                  </th>
                </tr>
              </>
              ))}
            </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center h-full p-8">
              <FolderSearch className="h-8 w-8 text-secondary/50 mx-4" />
              <p className="text-gray-400">No Certificates Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CertificatesPage;
