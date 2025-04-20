"use client";

import React, { useEffect, useState } from "react";
import DashboardCourseCard from "@/app/components/DashboardCourseCard";
import OpenedxDashboardCourseCard from "@/app/components/OpenedxDashboardCourseCard";
import EmptyDashboard from "@/app/components/EmptyDashboard";
import DashboardCourseCardLoader from "@/app/components/DashboardCourseCardLoader";

interface Props {
  params: {
    domain: string;
  };
}

const Dashboard = ({ params: { domain } }: Props) => {
  const [site, setSite] = useState<any>(null);
  const [enrollments, setEnrollments] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      // get site data
      const SiteResponse = await fetch(
        `/api/getSitePublicData?domainName=${domain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`
      );
      const siteData = await SiteResponse.json();
      setSite(siteData.site);
      // Get Enrollments
      const EnrollmentsResponse = await fetch("/api/enrollments");
      const enrollmentsData = await EnrollmentsResponse.json();
      /// filter only enrollments for this site
      const enrollments = enrollmentsData.enrollments.filter(
        (enrollment: any) => enrollment.siteId === siteData.site.id
      );
      setEnrollments(enrollments);
      setLoading(false);
    };
    getDashboardData();
  }, [domain]);

  return (
    <div className="mx-12 my-24">
      <div className="text-3xl font-black">Dashboard</div>
      <div className="grid grid-cols-3 my-12">
        {loading ? (
          <DashboardCourseCardLoader />
        ) : (
          <div className="col-span-3 border-2 border-dashed rounded-lg py-12 px-8">
            {enrollments.length > 0 ? (
              enrollments.map((enrollment: any) => (
                <div key={enrollment.id}>
                  {enrollment.course.externalId ? (
                    <OpenedxDashboardCourseCard enrollment={enrollment} site={site} lastVisitedContent={enrollment.lastVisitedContent}/>
                  ) : (
                    <DashboardCourseCard enrollment={enrollment} site={site} lastVisitedContent={enrollment.lastVisitedContent}/>
                  )}
                </div>
              ))
            ) : (
              <EmptyDashboard />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
