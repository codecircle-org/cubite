"use client";

import React, { useEffect, useRef, useState } from "react";
import CryptoJS from "crypto-js";
import { decryptSecret } from "@/app/utils/secretManager";
import { Headphones, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import getOpenedxContentStructure from "@/app/utils/getOpenedxContentStructure";

interface LTIConfig {
  consumerKey: string;
  consumerSecret: string;
  launchUrl: string;
  userEmail: string;
  firstName: string;
  lastName: string;
}

// Add helper functions to find adjacent units
const findAdjacentUnits = (courseStructure: any, currentBlockId: string) => {
  let prevUnit = null;
  let nextUnit = null;

  // Decode the blockId from the URL
  const decodedBlockId = decodeURIComponent(currentBlockId);
  
  // Flatten all units into a single array while maintaining order
  const allUnits = courseStructure.chapters.flatMap((chapter: any) =>
    chapter.subsections.flatMap((subsection: any) => subsection.units)
  );

  // Find current unit index using decoded blockId
  const currentIndex = allUnits.findIndex((unit: any) => unit.id === decodedBlockId);

  if (currentIndex !== -1) {
    if (currentIndex > 0) {
      prevUnit = allUnits[currentIndex - 1];
    }
    if (currentIndex < allUnits.length - 1) {
      nextUnit = allUnits[currentIndex + 1];
    }
  }
  return { prevUnit, nextUnit };
};

function BlockPage({
  params: { courseId, domain, blockId },
}: {
  params: { courseId: string; domain: string; blockId: string };
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [site, setSite] = useState<any>(null);
  const [courseData, setCourseData] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [supportForm, setSupportForm] = useState({
    subject: "",
    message: "",
  });
  const [courseStructure, setCourseStructure] = useState<any>(null);
  const [openedxAccessToken, setOpenedxAccessToken] = useState("");
  const [lastVisitedContent, setLastVisitedContent] = useState<string | null>(null);

  const generateNonce = (length = 32) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let nonce = "";
    for (let i = 0; i < length; i++) {
      nonce += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return nonce;
  };

  const generateSignature = (
    method: string,
    url: string,
    parameters: Record<string, string>,
    secret: string
  ) => {
    const sortedParams: Record<string, string> = {};
    Object.keys(parameters)
      .sort()
      .forEach((key) => {
        sortedParams[key] = parameters[key];
      });

    let baseString = method + "&" + encodeURIComponent(url) + "&";
    const paramString = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    baseString += encodeURIComponent(paramString);

    const signatureKey = encodeURIComponent(secret) + "&";
    const signature = CryptoJS.HmacSHA1(baseString, signatureKey);
    return signature.toString(CryptoJS.enc.Base64);
  };

  useEffect(() => {
    const getSiteData = async () => {
      const siteDataResponse = await fetch(
        `/api/getSitePublicData?domainName=${domain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`
      );
      const siteData = await siteDataResponse.json();
      setSite(siteData.site);
      const formData = new URLSearchParams({
        client_id: decryptSecret(siteData.site.openedxOauthClientId),
        client_secret: decryptSecret(siteData.site.openedxOauthClientSecret),
        grant_type: "client_credentials",
        token_type: "jwt",
      });
      const accessTokenResponse = await fetch(
        `${siteData.site.openedxSiteUrl}/oauth2/access_token`,
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
    getSiteData();
  }, [domain]);

  useEffect(() => {
    const fetchData = async () => {
      const [courseRes, sessionRes] = await Promise.all([
        fetch(`/api/course/${courseId}`),
        fetch("/api/auth/session"),
      ]);
      const [courseData, sessionData] = await Promise.all([
        courseRes.json(),
        sessionRes.json(),
      ]);
      setCourseData(courseData);
      setSessionData(sessionData);
    };
    fetchData();
  }, [courseId]);

  useEffect(() => {
    if (!site) return;
    const launchLTI = async () => {
      try {
        // First, get the course data to get the OpenEdX URL
        const courseResponse = await fetch(`/api/course/${courseId}`);
        const courseData = await courseResponse.json();

        // Get user session data
        const sessionResponse = await fetch("/api/auth/session");
        const sessionData = await sessionResponse.json();

        if (!sessionData.user) {
          throw new Error("User not authenticated");
        }

        const openedxUrl = site.openedxSiteUrl;
        const launchUrl = decodeURIComponent(
          `${openedxUrl}/lti_provider/courses/${courseData.course.externalId}/${blockId}`
        );
        const config: LTIConfig = {
          consumerKey: decryptSecret(site.openedxLtiConsumerKey),
          consumerSecret: decryptSecret(site.openedxLtiConsumerSecret),
          launchUrl: launchUrl,
          userEmail: sessionData.user.email,
          firstName:
            sessionData.user.firstName ||
            sessionData.user.name?.split(" ")[0] ||
            "",
          lastName:
            sessionData.user.lastName ||
            sessionData.user.name?.split(" ")[1] ||
            "",
        };

        const timestamp = Math.floor(Date.now() / 1000);
        const nonce = generateNonce();

        const launchParams = {
          // Required LTI parameters
          lti_message_type: "basic-lti-launch-request",
          lti_version: "LTI-1p0",
          resource_link_id: blockId,

          // OAuth parameters
          oauth_version: "1.0",
          oauth_consumer_key: config.consumerKey,
          oauth_signature_method: "HMAC-SHA1",
          oauth_timestamp: timestamp.toString(),
          oauth_nonce: nonce,

          // User identity parameters
          user_id: config.userEmail,
          lis_person_contact_email_primary: config.userEmail,
          lis_person_name_given: config.firstName,
          lis_person_name_family: config.lastName,
          lis_person_name_full: `${config.firstName} ${config.lastName}`,

          // Role and context
          roles: "Learner",
          context_id: courseData.course.externalId,

          // Display settings
          launch_presentation_document_target: "iframe",
        };

        // Generate OAuth signature
        launchParams.oauth_signature = generateSignature(
          "POST",
          config.launchUrl,
          launchParams,
          config.consumerSecret
        );

        // Create and submit the form
        if (formRef.current) {
          formRef.current.action = config.launchUrl;
          formRef.current.innerHTML = "";

          Object.entries(launchParams).forEach(([key, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value;
            formRef.current?.appendChild(input);
          });

          formRef.current.submit();
        }
      } catch (error) {
        console.error("LTI launch failed:", error);
      }
    };
    launchLTI();
  }, [site, courseId, blockId]);

  // Add effect to get course structure and find adjacent units
  useEffect(() => {
    const fetchCourseStructure = async () => {
      if (!site || !sessionData?.user?.email || !courseData?.course?.externalId) return;

      const structure = await getOpenedxContentStructure(
        openedxAccessToken,
        site.openedxSiteUrl,
        courseData.course.externalId,
        sessionData.user.email,
        courseId
      );

      if (structure) {
        setCourseStructure(structure);
      }
    };

    fetchCourseStructure();
  }, [site, sessionData, courseData, blockId, courseId, openedxAccessToken]);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailContent = {
      type: "support",
      subject: supportForm.subject,
      message: supportForm.message,
      site: site,
      metadata: {
        courseName: courseData?.course?.name,
        courseId: courseData?.course?.externalId,
        blockId: blockId,
        currentUrl: window.location.href,
        user: {
          email: sessionData?.user?.email,
          name: sessionData?.user?.name,
        },
      },
    };

    // make api call to send email
    const response = await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify(emailContent),
    });

    // Clear form and close modal
    setSupportForm({ subject: "", message: "" });
    const modal = document.getElementById("modal-support") as HTMLDialogElement;
    modal?.close();
    toast.success("Support request sent successfully.");
  };

  return (
    <div className="flex flex-col relative">
      {/* Content iframe */}
      <form
        ref={formRef}
        method="post"
        target="blockContent"
        className="hidden"
      />
      <iframe
        name="blockContent"
        className="h-[calc(100vh-8rem)] w-full overflow-hidden border-t-4 border-primary px-4"
        style={{
          minHeight: '1200px',
          height: 'calc(100vh - 8rem)',
          width: '100%',
        }}
        title="Course Content"
        scrolling="no"
      />

      {/* Floating Support Button */}
      <button
        className="fixed z-50 right-6 bottom-6 btn btn-circle btn-primary shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={() => {
          const modal = document.getElementById("modal-support") as HTMLDialogElement;
          modal?.showModal();
        }}
      >
        <Headphones className="w-6 h-6" />
      </button>


      {/* Support Modal */}
      <dialog id="modal-support" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg mb-4">Contact Support</h3>
          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">
                  Subject{" "}
                  <span className="mx-2 text-xs text-gray-500">
                    Please describe your issue in a few words.
                  </span>
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={supportForm.subject}
                onChange={(e) =>
                  setSupportForm((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Message</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-32"
                value={supportForm.message}
                onChange={(e) =>
                  setSupportForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Send
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  const modal = document.getElementById(
                    "modal-support"
                  ) as HTMLDialogElement;
                  modal?.close();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default BlockPage;
