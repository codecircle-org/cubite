"use client";

import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import registerUser from "./actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

const initialState = {
  status: 0,
  message: "",
  user: {
    id: "",
    email: "",
  },
};

const Register = () => {
  const [state, formAction] = useFormState(registerUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.status === 201) {
      router.push("/admin");
    }
  }, [state, router]);
  return (
    <div className="flex items-center justify-center mt-52">
      <div className="p-8 rounded w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create an Account
        </h2>
        <p className="mb-6 text-center">
          Please fill all the following fields to get started.
        </p>
        {state.status === 400 ? (
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
              {state.message.split(", ").map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </div>
          </div>
        ) : null}

        <form action={formAction}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm"
                minLength={6}
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                minLength={3}
                required
                placeholder="john.doe"
                className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="john@example.com"
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter a password"
              minLength={6}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="organization" className="block text-sm font-medium">
              Organization
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              placeholder="Acme Inc."
              minLength={3}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm"
            />
          </div>
          <button type="submit" className="w-full btn btn-primary">
            Register
          </button>
          <p className="pt-4">
            You already have an account ? Login{" "}
            <Link className="underline" href="/auth/signin">
              here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
