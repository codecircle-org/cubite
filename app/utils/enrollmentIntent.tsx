import { getCookie, deleteCookie } from 'cookies-next';
import { Course } from '@prisma/client';
import openedxEnrollUser from './openedxEnrollUser';
import { Site } from '@prisma/client';
interface EnrollmentIntent {
  courseId: string;
  siteId: string;
  paid: boolean;
  externalId: string;
  externalUrl: string;
}

interface EnrollmentData {
  courseId: string;
  name?: string;
  email?: string;
  username?: string;
  siteId: string;
}

interface Session {
  user: {
    name?: string;
    email?: string;
    username?: string;
  };
}

export const getEnrollmentIntent = () => {
  try {
    const intent = getCookie('enrollmentIntent');
    return intent ? JSON.parse(intent as string) as EnrollmentIntent : null;
  } catch {
    return null;
  }
};

export const clearEnrollmentIntent = () => {
  deleteCookie('enrollmentIntent');
};

export const processEnrollmentIntent = async (session: Session, site: Site) => {
  const intent = getEnrollmentIntent();
  if (!intent || !session) return null;

  try {
    const { courseId, siteId, paid, isWaitList } = intent;
    const course = {
      id: intent.courseId,
      externalId: intent.externalId,
      externalUrl: intent.externalUrl,
      isWaitList: intent.isWaitList,
    }
    if (!paid || isWaitList) {
      if (intent.externalId) {
        const openedxEnrollmentResult = await openedxEnrollUser(site, course, session?.user?.email);
      }
      // Handle free course enrollment
      const enrollmentData: EnrollmentData = {
        courseId,
        name: session.user.name,
        email: session.user.email,
        username: session.user.username,
        siteId,
      };

      if(isWaitList) {
        enrollmentData.isWaitListed = true;
      }

      const enrollmentResponse = await fetch(`/api/enrollments/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enrollmentData),
      });

      if (enrollmentResponse.ok) {
        clearEnrollmentIntent();

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
        return {
          success: true,
          paid: false,
          redirectUrl: `/dashboard`,
        };
      }
    }
  } catch (error) {
    console.error('Error processing enrollment intent:', error);
    return {
      success: false,
      error: 'Failed to process enrollment',
    };
  }

  return null;
};