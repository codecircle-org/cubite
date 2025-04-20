"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { handlePaidCourseEnrollment } from "../utils/paidCourseEnrollment";
import { setCookie } from "cookies-next";
import openedxEnrollUser from "../utils/openedxEnrollUser";
import { useRouter } from "next/navigation";  
import toast from "react-hot-toast";
interface Props {
  courseId: string;
  siteId: string;
  course: {};
  site: {};
}

const Enrollment = ({ courseId, siteId, course, site }: Props) => {
  const { status, data: session } = useSession();
  const [enrollments, setEnrollments] = useState([]);
  const [enrollment, setEnrollment] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isUserWaitListed, setIsUserWaitListed] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const constructEnrollmentUrl = (externalUrl: string, externalId: string) => {
    // Get the base domain from externalUrl
    const domain = new URL(externalUrl).origin;
    // Construct enrollment URL
    return `${domain}/account/finish_auth?course_id=${externalId}&enrollment_action=enroll`;
  };

  const constructURL = (course: any) => {
    if (course.externalId) {
      return `/course/${courseId}/learning/`;
    } else {
      return `/course/${courseId}/courseware/`;
    }
  };

  const getPaymentStatus = async () => {
    const response = await fetch("/api/paymentStatus", {
      method: "POST",
      body: JSON.stringify({ courseId, siteId, email: session?.user?.email }),
    });
    const paymentStatusResult = await response.json();
    if (paymentStatusResult.status === 200) {
      setPaymentStatus(paymentStatusResult.paymentStatus);
    }
  };

  const handleEnrollUser = async (enrollmentStatus = "completed") => {
    if (course.externalId) {
      const openedxEnrollmentResult = await openedxEnrollUser(
        site,
        course,
        session?.user?.email
      );
    }
    // Existing free course enrollment logic
    const enrollmentData = {
      courseId: courseId,
      name: session?.user.name,
      email: session?.user?.email,
      username: session?.user.username,
      siteId: siteId,
      status: enrollmentStatus,
    };
    if (course.externalId) {
      enrollmentData.enrolledInOpenedxCourse = true;
    }
    if (course.isWaitList) {
      enrollmentData.isWaitListed = true;
    }
    const response = await fetch(`/api/enrollments/${courseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enrollmentData),
    });

    const result = await response.json();
    if (result.status === 201 || result.status === 200) {
      try {
        // Assuming the enrollment is created successfully, update the enrollments state
        setEnrollments((prevEnrollments) => [
          ...prevEnrollments,
          {
            courseId: courseId,
            siteId: siteId,
            userId: session?.user.id,
          },
        ]);
        setIsEnrolled(true);

        if(enrollmentStatus === "completed") {
          toast.success("You are enrolled in the course");
          router.push(constructURL(course));
        } else {
          toast.success("You are in the waitlist");
          router.push("/dashboard");
        }
        // send enrollment email
        const emailResponse = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            site,
            course,
            userFirstname: session?.user.name,
            to: session?.user?.email,
            subject: `You are enrolled into ${course?.name}`,
            type: "enrollment",
          }),
        });
      } catch (error) {
        console.log(error);
      }
    }
  };


  useEffect(() => {
    const getEnrollments = async () => {
      if (session) {
        const response = await fetch("/api/enrollments", {
          cache: "no-store",
        });
        const result = await response.json();
        setEnrollments(result.enrollments);
        setEnrollment(
          result.enrollments.find(
            (enrollment) => enrollment.courseId === courseId
          )
        );
      }
    };
    getEnrollments();
  }, [session]);

  useEffect(() => {
    if (enrollments && enrollments.length > 0) {
      setIsEnrolled(enrollment && Object.keys(enrollment).length > 0);
      setIsUserWaitListed(enrollment && enrollment.isWaitListed);
      if (course.price > 0) {
        getPaymentStatus();
      }
    }
  }, [enrollments, enrollment, courseId]);

  const hasAccessToCourse = (enrollment) => {
    // Course hasn't started yet and isn't on-demand
    if (isEnrolled && new Date(course.startDate) > new Date() && !course.isOnDemand) {
      return false;
    }
    
    // Base requirements for all courses
    const baseRequirements = isEnrolled && enrollment?.status === "completed";
    
    // Paid course with waitlist
    if (course.price > 0 && course.isWaitList) {
      return paymentStatus.status === "paid" && !isUserWaitListed && baseRequirements;
    }
    
    // Paid course without waitlist
    if (course.price > 0) {
      return paymentStatus.status === "paid" && baseRequirements;
    }
    
    // Free course with waitlist
    if (course.isWaitList) {
      return !isUserWaitListed && baseRequirements;
    }
    
    // Free course without waitlist
    return baseRequirements;
  };

  const getEnrollmentButtonText = () => {
    // User has access to the course
    if (hasAccessToCourse(enrollment)) {
      return "Continue";
    }
    
    // Course hasn't started yet and isn't on-demand
    if (isEnrolled && new Date(course.startDate) > new Date() && !course.isOnDemand && !course.isWaitList) {
      return "Coming Soon";
    }
    
    // Paid course with waitlist
    if (course.price > 0 && course.isWaitList) {
      if (isUserWaitListed) {
        return "You are in the waitlist";
      }
      
      if (paymentStatus.status === "unpaid" || enrollment?.status === "pending") {
        return "Complete Payment";
      }
      
      return "Add me to the waitlist";
    }

    if(course.price > 0 && new Date(course.startDate) > new Date() && !course.isOnDemand) {
      return "Coming Soon";
    }

    // Paid course without waitlist
    if (course.price > 0) {
      return `Enroll for $${course.price}`;
    }
    
    // Free course with waitlist
    if (course.isWaitList) {
      if (!isEnrolled) {
        return "Add me to the waitlist";
      }
      
      if (isEnrolled && !isUserWaitListed && enrollment?.status === "pending") {
        return "Complete Enrollment";
      }
      
      if (isEnrolled && isUserWaitListed) {
        return "You are in the waitlist";
      }
    }
    
    // Default case - free course without waitlist
    return "Enroll Now";
  };

  const handleEnrollment = async () => {
    if (!session) {
      // Handle unauthenticated user
      const intent = {
        courseId: courseId,
        siteId: siteId,
        paid: course.price > 0,
        externalId: course.externalId,
        externalUrl: site.openedxSiteUrl,
        isWaitList: course.isWaitList,
      };
      
      const isPaidNonWaitlistCourse = 
        course.price && 
        typeof course.price === "number" && 
        !isNaN(course.price) && 
        course.price > 0 && 
        !course.isWaitList;
      
      if (isPaidNonWaitlistCourse) {
        const successUrl = `${window.location.origin}/auth/signin`;
        const cancelUrl = `${window.location.origin}/course/${courseId}/about`;
        handlePaidCourseEnrollment(course, site, successUrl, cancelUrl);
      } else {
        setCookie("enrollmentIntent", JSON.stringify(intent));
        window.location.href = `/auth/signin`;
      }
      return;
    }
    // User is authenticated
    if (hasAccessToCourse(enrollment)) {
      router.push(constructURL(course));
      return;
    }
    
    const isPaidCourse = 
      course.price && 
      typeof course.price === "number" && 
      !isNaN(course.price) && 
      course.price > 0;
    
    if (isPaidCourse) {
      if (course.isWaitList) {
        if (!isEnrolled) {
          handleEnrollUser("pending");
        } else if (isEnrolled && !isUserWaitListed) {
          const successUrl = `${window.location.origin}${constructURL(course)}`;
          const cancelUrl = `${window.location.origin}/course/${courseId}/about`;
          handlePaidCourseEnrollment(course, site, successUrl, cancelUrl, {
            email: session.user.email,
            name: session.user.name,
            id: session.user.id,
          });
        }
      } else {
        const successUrl = `${window.location.origin}${constructURL(course)}`;
        const cancelUrl = `${window.location.origin}/course/${courseId}/about`;
        handlePaidCourseEnrollment(course, site, successUrl, cancelUrl, {
          email: session.user.email,
          name: session.user.name,
          id: session.user.id,
        });
      }
    } else if (course.isWaitList) {
      handleEnrollUser("pending");
    } else {
      handleEnrollUser();
    }
  };

  return (
    <div className="flex-none justify-self-end self-end">
      <button
        onClick={handleEnrollment}
        className="btn btn-primary"
        disabled={isUserWaitListed || (isEnrolled && new Date(course.startDate) > new Date() && !course.isOnDemand) || (course.price > 0 && new Date(course.startDate) > new Date() && !course.isOnDemand)}
      >
        {getEnrollmentButtonText()}
      </button>
    </div>
  );
};

export default Enrollment;
