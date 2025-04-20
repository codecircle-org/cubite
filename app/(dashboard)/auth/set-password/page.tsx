'use client'

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { z } from "zod";

function SetPasswordForm() {
    const router = useRouter();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const token = useSearchParams().get("token");
    const [password, setPassword] = useState("");

    if (!token) {
        router.push("/auth/signin");
    }

    const handleSubmit = async () => {
        const schema = z.object({
            password: z.string().min(8),
        });
        const result = schema.safeParse({ password });
        if (!result.success) {
            setError("Password must be at least 8 characters long");
            return;
        }
        const res = await fetch("/api/auth/set-password", {
            method: "POST",
            body: JSON.stringify({ token, password }),
        });
        const data = await res.json();
        if (data.status === 200) {
            setSuccess(data.success);
            setTimeout(() => {
                router.push("/auth/signin");
            }, 1000);
        } else {
            setError(data.error);
        }
    };

    return (
        <div className="flex items-center justify-center mt-52">
            <div className="p-8 rounded w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-left">Enter New Password</h2>
                <p className="mb-6 text-left">
                    Please enter your new password.
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
                            type="password"
                            name="password"
                            id="password"
                            placeholder="New Password"
                            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none sm:text-sm"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={handleSubmit} className="w-full py-2 px-4 btn btn-primary">
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SetPasswordForm />
        </Suspense>
    );
}