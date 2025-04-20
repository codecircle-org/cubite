import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main className="flex flex-col items-center justify-center min-h-[100dvh] bg-gradient-to-br px-4 md:px-6 py-12 md:py-24 lg:py-24">
      <div className="container max-w-4xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight  sm:text-5xl md:text-6xl lg:text-7xl">
          {!session
            ? "Elevate Your Learning Experience"
            : `Welcome ${session.user!.name}`}
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl">
          {!session
            ? "Unlock the power of AI-driven learning with our cutting-edge platform. Streamline your educational journey and achieve your goals."
            : "Click on Dahsboard to continue"}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          {!session ? (
            <>
              <Link className="btn btn-primary" href="/auth/register">
                Get Started
              </Link>
              <Link className="btn btn-outline px-6" href="/auth/signin">
                Login
              </Link>
            </>
          ) : (
            <Link className="btn btn-outline px-6" href="/admin">
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
