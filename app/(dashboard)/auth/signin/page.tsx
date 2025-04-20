"use client";

import React, { useState, useEffect } from "react";
import { getProviders, signIn } from "next-auth/react";
import Link from "next/link";

const SignIn = () => {
  const [providers, setProviders] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };

    fetchProviders();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      let errorMessage = "An error occurred. Please try again.";
      if (result.error === "CredentialsSignin") {
        errorMessage = "Invalid email or password. Please try again.";
      }
      setError(errorMessage);
    } else {
      // Redirect to admin or another page on successful sign-in
      window.location.href = "/admin";
    }
  };

  return (
    <div className="flex items-center justify-center mt-52">
      <div className="p-8 rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <p className="mb-6 text-center">
          Please enter your credentials to sign in.
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
        <form onSubmit={handleSubmit} className="space-y-6">
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
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm"
              required
            />
            <p className="text-xs text-base-content pt-2">
              Forgot your password?{" "}
              <Link className="underline" href="/auth/reset-password">
                Reset password
              </Link>
            </p>
          </div>
          <button type="submit" className="w-full py-2 px-4 btn btn-primary">
            Sign in
          </button>
          <p>
            You don&apos;t have account ? Register{" "}
            <Link className="underline" href="/auth/register">
              here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
