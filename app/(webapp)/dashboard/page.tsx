"use client";
import React from "react";
import { LogoutAction } from "@/services/actions/auth";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await LogoutAction();

      if (!res.isSuccessful) {
        throw new Error(res.message);
      }

      await signOut({ redirect: false });
      router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Dashboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleSignOut}
        className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-400 transition duration-300 ease-in-out"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 inline-block mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v2a1 1 0 11-2 0V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
          <path d="M4.293 9.293a1 1 0 011.414 0L10 13.586l4.293-4.293a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414z" />
        </svg>
        <span>Sign Out</span>
      </button>
      <p>Welcome to the dashboard!</p>
    </div>
  );
}

export default Dashboard;
