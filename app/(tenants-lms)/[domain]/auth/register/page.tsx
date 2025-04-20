"use client";

import React, { useState, useEffect } from "react";
import Alert from "@/app/components/Alert";
import { z } from "zod";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import { processEnrollmentIntent } from "@/app/utils/enrollmentIntent";
import { getCookie } from "cookies-next";
import { parseMarkdown } from "@/app/utils/markdownParser";
import createOpenedxUser from "@/app/utils/createOpenedxUser";
import getOpenedxAccessToken from "@/app/utils/getOpenedxAccessToken";
import SsoProviders from "@/app/components/SsoProviders";

interface Props {
  params: {
    domain: string;
  };
}

const Register = ({ params: { domain } }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userObject, setUserObject] = useState({
    siteId: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    extraInfo: {},
  });

  const [status, setStatus] = useState(0);
  const [message, setMessage] = useState([]);
  const [site, setSite] = useState(null);
  const [extraRegistrationFields, setExtraRegistrationFields] = useState([]);
  const [registrationForm, setRegistrationForm] = useState({});
  const [openedxAccessToken, setOpenedxAccessToken] = useState("");

  useEffect(() => {
    async function getSites() {
      try {
        const response = await fetch(`/api/getSitesPublicData`, {
          cache: "no-store",
        });
        const result = await response.json();
        if (result.status === 200) {
          const siteData = result.sites.find(
            (s) =>
              s.domainName.split(
                `.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`
              )[0] === domain
          );
          setSite(siteData);
          setRegistrationForm(siteData.registrationForm || {});
          setExtraRegistrationFields(siteData.extraRegistrationFields || []);
        }
      } catch (error) {
        console.error("Error fetching site data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getSites();
  }, [domain]);

  useEffect(() => {
    const getAccessToken = async () => {
      if (site?.openedxSiteUrl) {
        const accessToken = await getOpenedxAccessToken(site);
        setOpenedxAccessToken(accessToken);
      }
    };
    getAccessToken();
  }, [site]);

  const schema = z.object({
    firstName: z
      .string()
      .min(3, { message: "First Name should be at least 3 characters" }),
    lastName: z
      .string()
      .min(3, { message: "Last Name should be at least 3 characters" }),
    username: z
      .string()
      .min(3, { message: "Username should be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password should be at least 6 characters long" })
      .max(32, { message: "Password should be at most 32 characters long" })
      .refine(
        (password) => {
          const hasNumber = /[0-9]/.test(password);
          const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
          return hasNumber && hasSpecialCharacter;
        },
        {
          message:
            "Password must contain at least one number and one special character",
        }
      ),
  });

  const handleUserObject = (e) => {
    setUserObject({
      ...userObject,
      [e.target.id]: e.target.value,
    });
  };

  const handleExtraInfo = (e) => {
    const value =
      e.target.type === "select-one"
        ? e.target.options[e.target.selectedIndex].value
        : e.target.value;

    setUserObject({
      ...userObject,
      extraInfo: {
        ...userObject.extraInfo,
        [e.target.id]: value,
      },
    });
  };

  const handleCreateUser = async () => {
    userObject.siteId = site.id;
    const validation = schema.safeParse(userObject);
    if (!validation.success) {
      setStatus(400);
      setMessage(validation.error.issues.map((issue) => issue.message));
    } else {
      try {
        const response = await fetch("/api/student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userObject),
        });
        const result = await response.json();
        setStatus(result.status);
        setMessage([result.message]);

        if (result.status === 200 || result.status === 201) {
          if (site?.openedxSiteUrl) {
            const createUserResponse = await createOpenedxUser(
              site?.openedxSiteUrl,
              openedxAccessToken,
              userObject.email,
              userObject.firstName + " " + userObject.lastName,
              userObject.username
            );
          }
          const result = await signIn("credentials", {
            redirect: false,
            email: userObject.email,
            password: userObject.password,
          });

          // Get the session after sign in
          const session = await getSession();
          // make sure we can send email with + in the api call
          const parsedEmail =
            userObject.email.split("@")[0].replace(/\+/g, "%2B") +
            "@" +
            userObject.email.split("@")[1];

          // check if the user has any pending paid enrollments
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

          // process enrollment intent
          const enrollmentIntent = getCookie("enrollmentIntent");
          if (enrollmentIntent) {
            const enrollmentIntentResult = await processEnrollmentIntent(
              session,
              site
            );
            if (enrollmentIntentResult?.success) {
              window.location.href = enrollmentIntentResult.redirectUrl;
            } else {
              // Redirect to index or another page on successful sign-in
              window.location.href = "/";
            }
          }

          window.location.href = "/dashboard";

          // send welcome email
          const emailResponse = await fetch("/api/send-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              site,
              userFirstname: userObject.firstName,
              to: userObject.email,
              subject: `Welcome to ${site?.name}`,
              type: "welcome",
            }),
          });
        }
      } catch (error) {
        setStatus(500);
        setMessage(["An error occurred while creating the user."]);
      }
    }
  };

  return (
    <>
      {status !== 0 && (
        <Alert
          status={status}
          message={
            <ul>
              {message.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          }
          onClose={() => {
            setStatus(0);
            setMessage([]);
          }}
        />
      )}
      <div className="mx-auto max-w-lg grid grid-cols-4 justify-items-center gap-4 my-32 p-8 rounded w-full col-span-full space-y-4">
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
              <p className="text-left text-2xl font-semibold">
                {registrationForm?.title || "Create an Account"}
              </p>
              {site?.registrationFormVisible && (
                <p className="text-left my-2 text-sm text-gray-500">
                  {registrationForm?.description ||
                    "Please fill this form to create your account"}
                </p>
              )}
            </div>
            {site?.registrationFormVisible && (
              <>
                <label className="input input-bordered flex items-center gap-2 col-span-full md:col-span-2 w-full">
                  <input
                    type="text"
                    className="grow"
                    placeholder="First Name"
                    name="firstName"
                    id="firstName"
                    value={userObject.firstName}
                    onChange={handleUserObject}
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2 col-span-full md:col-span-2 w-full">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Last Name"
                    name="lastName"
                    id="lastName"
                    value={userObject.lastName}
                    onChange={handleUserObject}
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2 col-span-full w-full">
                  <input
                    type="text"
                    className="grow"
                    placeholder="Username"
                    name="username"
                    id="username"
                    value={userObject.username}
                    onChange={handleUserObject}
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2 col-span-full w-full">
                  <input
                    type="email"
                    className="grow"
                    placeholder="Email"
                    name="email"
                    id="email"
                    value={userObject.email}
                    onChange={handleUserObject}
                  />
                </label>
                <label className="input input-bordered flex items-center gap-2 col-span-full w-full">
                  <input
                    type="password"
                    className="grow"
                    placeholder="Password"
                    name="password"
                    id="password"
                    value={userObject.password}
                    onChange={handleUserObject}
                  />
                </label>
                {site &&
                  site.extraRegistrationFields &&
                  site.extraRegistrationFields.map((field) => (
                    <label
                      key={field.text}
                      className={`flex items-center gap-2 col-span-full w-full ${
                        field.type != "dropdown" && "input input-bordered"
                      }`}
                    >
                      {field.type === "dropdown" ? (
                        <select
                          className="select select-bordered w-full"
                          id={field.text}
                          required={field.required}
                          onChange={handleExtraInfo}
                        >
                          <option value="">Select {field.text}</option>
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          className="grow"
                          placeholder={field.text}
                          name={field.text}
                          id={field.text}
                          required={field.required}
                          onChange={handleExtraInfo}
                        />
                      )}
                    </label>
                  ))}
                <button
                  className="btn btn-primary col-span-full w-full"
                  onClick={handleCreateUser}
                >
                  {registrationForm?.buttonText || "Register"}
                </button>
                <p className="text-left text-sm text-gray-500 col-span-full justify-self-start">
                  You already have an account? Sign in{" "}
                  <Link className="underline" href="/auth/signin">
                    here
                  </Link>
                </p>
              </>
            )}
            {registrationForm?.secondaryTitle && (
              <p className="text-left text-2xl font-medium col-span-full justify-self-start mt-8">
                {parseMarkdown(registrationForm?.secondaryTitle)}
              </p>
            )}
            {registrationForm?.secondaryDescription && (
              <p className="text-left text-md col-span-full justify-self-start leading-relaxed text-gray-500">
                {parseMarkdown(registrationForm?.secondaryDescription)}
              </p>
            )}
            <div className="flex flex-col gap-2 w-full col-span-full">
              {(site?.ssoProviders?.githubClientId ||
                site?.ssoProviders?.googleClientId ||
                site?.ssoProviders?.facebookClientId) &&
                site?.registrationFormVisible && (
                  <div className="divider text-xs text-gray-500">
                    or continue with
                  </div>
                )}
            </div>
            {site && site.ssoProviders && <SsoProviders site={site} />}
          </>
        )}
      </div>
    </>
  );
};

export default Register;
