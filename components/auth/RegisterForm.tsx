"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { handleGoogleSignIn } from "@/lib/authService";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const router = useRouter();

  // Email/password signup — NO DB writes here
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // move to complete-profile where we will write DB entries
      router.push("/complete-profile");
    } catch (err: any) {
      setError(err.message || "Failed to register");
      setIsLoading(false);
    }
  };

  // Google sign in — do not write DB here; complete-profile will handle DB writes
  const handleGoogleRegister = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    setError(null);

    try {
      await handleGoogleSignIn(router); // should only sign-in
      router.push("/complete-profile");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-8 shadow-sm">
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-1 text-gray-500">Start your health journey today</p>
      </div>

      {/* Role selector */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <label
          className={`p-3 border rounded cursor-pointer ${
            role === "patient"
              ? "border-blue-600 ring-2 ring-blue-600"
              : "border-gray-300"
          }`}
        >
          <input
            type="radio"
            name="role"
            value="patient"
            checked={role === "patient"}
            onChange={() => setRole("patient")}
            className="sr-only"
          />
          Patient
        </label>
        <label
          className={`p-3 border rounded cursor-pointer ${
            role === "doctor"
              ? "border-blue-600 ring-2 ring-blue-600"
              : "border-gray-300"
          }`}
        >
          <input
            type="radio"
            name="role"
            value="doctor"
            checked={role === "doctor"}
            onChange={() => setRole("doctor")}
            className="sr-only"
          />
          Doctor
        </label>
      </div>

      <form onSubmit={handleRegister} className="mt-6 space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="w-full border rounded-md p-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="w-full border rounded-md p-2"
        />

        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Creating account..." : "Continue"}
        </button>
      </form>

      {error && <p className="mt-4 text-center text-red-500">{error}</p>}

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">or</span>
        </div>
      </div>

      <button
        onClick={handleGoogleRegister}
        disabled={isLoading || isGoogleLoading}
        className="w-full flex justify-center items-center gap-2 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
      >
        {isGoogleLoading ? "Signing up..." : "Sign up with Google"}
      </button>
    </div>
  );
}
