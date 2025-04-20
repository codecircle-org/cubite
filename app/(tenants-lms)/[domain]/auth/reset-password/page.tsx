'use client'

import React, { useState, useEffect } from "react";
import { z } from "zod";

export default function ResetPasswordPage({params}: {params: {domain: string}}) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [site, setSite] = useState<any | null>(null);

    useEffect(() => {
        async function getSites() {
            const response = await fetch(`/api/getSitePublicData?domainName=${params.domain}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN}`, {
                cache: "no-store",
            });
            const result = await response.json();
            setSite(result.site);
        }
        getSites();
    }, [params.domain]);

    const handleSubmit = async () => {
        const schema = z.object({
            email: z.string().email(),
        });
        const result = schema.safeParse({ email });
        if (!result.success) {
            setError("Invalid email address");
            return;
        }
        setError(null);
        const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({ email }),
        });
        const response = await res.json();
        if (response.status === 200) {
            const emailResponse = await fetch("/api/send-email", {
                method: "POST",
                body: JSON.stringify({ type: "password-reset", email: email, token: response.token.token, site: site }),
            });
            const emailResponseJson = await emailResponse.json();
            if (emailResponseJson.status === 200) {
                setSuccess("We have sent you an email to reset your password.");
            } else {
                setError(emailResponseJson.message);
            }
        } else {
            setError(response.message);
        }
    }

  return (
    <div className="flex items-center justify-center mt-32">
    <div className="p-8 rounded w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-left">Reset Password</h2>
      <p className="mb-6 text-left">
        Please enter your email to reset your password. You will receive an email with a link to reset your password.
      </p>
      {error && (
        <div role="alert" className="alert alert-error my-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            {error.split(", ").map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </div>
        </div>
      )}
    {success && (
        <div role="alert" className="alert alert-success my-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            {success.split(", ").map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-6">
        <div className="mb-4">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button onClick={handleSubmit} className="w-full py-2 px-4 btn btn-primary">
          Reset Password
        </button>
      </div>
    </div>
  </div>
  )
}
