"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getSession, signIn, signOut } from "next-auth/react";
import { getCookie } from "cookies-next";
import Alert from "./Alert";
import { processEnrollmentIntent } from "../utils/enrollmentIntent";
import SsoProviders from "./SsoProviders";

interface Props {
  siteId: string;
  site: {
    id: string;
    domainName: string;
    loginForm?: {
      title?: string;
      description?: string;
      buttonText?: string;
    };
  };
}

function SiteSignin({ siteId, site }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSignIn = async () => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      let errorMessage = "An error occurred. Please try again.";
      setStatus(result.status);
      if (result.error === "CredentialsSignin") {
        errorMessage = "Invalid email or password. Please try again.";
        setStatus(result.status);
      }
      setError(errorMessage);
    } else {
      // Check if the user is part of this site
      const response = await fetch("/api/student", {
        cache: "no-store",
      });
      const result = await response.json();
      const session = await getSession();

      // check if the user has any pending paid enrollments
      const parsedEmail =
        session?.user?.email?.split("@")[0].replace(/\+/g, "%2B") +
        "@" +
        session?.user?.email?.split("@")[1];

      const pendingEnrollmentsResponse = await fetch(
        `/api/getPendingPaidEnrollments?siteId=${site?.id}&email=${parsedEmail}`
      );
      const pendingEnrollments = await pendingEnrollmentsResponse.json();
      if (pendingEnrollments.data.length > 0) {
        const enrollResponse = await fetch("/api/enrollPendingCourses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pendingEnrollments: pendingEnrollments.data,
            userId: session?.user?.id, // Use ID from session
          }),
        });
        const enrollResult = await enrollResponse.json();
      }

      //check if there is an enrollmentIntent cookie
      const enrollmentIntent = getCookie("enrollmentIntent");
      if (enrollmentIntent) {
        // Process enrollment intent if exists
        const enrollmentResult = await processEnrollmentIntent(session, site);
        if (enrollmentResult?.success) {
          window.location.href = enrollmentResult.redirectUrl;
          return;
        }
      }

      // Normal site access flow
      if (result.status === 200) {
        const siteRoles = result.student.siteRoles;
        const isMember = siteRoles.some((site) => site.siteId === siteId);

        if (isMember) {
          // Redirect to admin or another page on successful sign-in
          window.location.href = site.domainName.includes("ncec")
            ? "/portal"
            : "/dashboard";
        } else {
          setStatus(401);
          setError("You are not part of this site, please register first");
          setTimeout(() => {
            signOut();
          }, 3000); // Delay for 3 seconds
        }
      } else {
        setStatus(401);
        setError("An error occurred while fetching user data.");
        setTimeout(() => {
          signOut();
        }, 3000); // Delay for 3 seconds
      }
    }
  };

  return (
    <div className="mx-auto max-w-lg grid grid-cols-4 justify-items-center gap-4 my-32">
      <div className="p-8 rounded w-full max-w-md col-span-full space-y-4">
        {isLoading ? (
          <div className="flex w-full flex-col gap-4 col-span-full">
            <div className="skeleton h-48 w-full"></div>
            <div className="flex flex-row gap-2">
              <div className="skeleton h-4 w-1/2"></div>
              <div className="skeleton h-4 w-1/2"></div>
            </div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        ) : (
          <>
            <div className="col-span-full space-y-4 mb-4">
              <h2 className="text-2xl font-bold mb-6 text-center">
                {site.loginForm?.title || "Sign In"}
              </h2>
              {site.loginFormVisible && (
                <>
                  <p className="mb-6 text-center">
                    {site.loginForm?.description ||
                      "Please enter your credentials to sign in."}
                  </p>
                  <Alert status={status} message={error} />
                </>
              )}
            </div>
            {site.loginFormVisible && (
              <div className="space-y-6 col-span-full w-full">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm"
                    required
                    onChange={handleEmail}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm"
                    required
                    onChange={handlePassword}
                  />
                  <p className="text-xs text-base-content pt-2">
                    Forgot your password?{" "}
                    <Link className="underline" href="/auth/reset-password">
                      Reset password
                    </Link>
                  </p>
                </div>
                <button
                  onClick={handleSignIn}
                  className="w-full py-2 px-4 btn btn-primary"
                >
                  {site.loginForm?.buttonText || "Sign in"}
                </button>
                <p className="text-left text-sm text-gray-500">
                  You don&apos;t have an account? Register{" "}
                  <Link className="underline" href="/auth/register">
                    here
                  </Link>
                </p>
              </div>
            )}
            <div className="flex flex-col gap-2 w-full col-span-full">
              {(site.ssoProviders?.githubClientId ||
                site.ssoProviders?.googleClientId ||
                site.ssoProviders?.facebookClientId) &&
                site.loginFormVisible && (
                  <div className="divider text-xs text-gray-500">
                    or continue with
                  </div>
                )}
            </div>
            {site.ssoProviders && <SsoProviders site={site} />}
          </>
        )}
      </div>
    </div>
  );
}

export default SiteSignin;
