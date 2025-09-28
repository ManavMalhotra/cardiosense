"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { handleGoogleSignIn } from "@/lib/authService"; // your existing google sign-in
import { getDatabase, ref, set, push } from "firebase/database";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  // 🚀 You can change role dynamically if you have a selector (for now assume patient)
  const role = "patient";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const db = getDatabase();

      // Save under /users
      await set(ref(db, "users/" + user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        role: role,
      });

      // If role == patient → also save in /patients
      if (role === "patient") {
        const newPatientRef = push(ref(db, "patients"));
        const patientId = newPatientRef.key;

        await set(newPatientRef, {
          name: user.displayName || "",
          dob: "",
          gender: "",
          height_cm: "",
          weight_kg: "",
          previous_diseases: [],
          reports: [],
        });

        // Link patientId back in the user node
        await set(ref(db, `users/${user.uid}/patientDataId`), patientId);
      }

      router.push("/complete-profile");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // NEW: Add handler for Google Registration
  const handleGoogleRegister = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    setError(null);

    try {
      const { user } = await handleGoogleSignIn(router); // your authService should return user
      const db = getDatabase();

      // Save under /users
      await set(ref(db, "users/" + user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        role: role,
      });

      // If role == patient → also save in /patients
      if (role === "patient") {
        const newPatientRef = push(ref(db, "patients"));
        const patientId = newPatientRef.key;

        await set(newPatientRef, {
          name: user.displayName || "",
          dob: "",
          gender: "",
          height_cm: "",
          weight_kg: "",
          previous_diseases: [],
          reports: [],
        });

        // Link patientId back in the user node
        await set(ref(db, `users/${user.uid}/patientDataId`), patientId);
      }
    } catch (err: any) {
      setError(err.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-8 shadow-sm">
      <div className="text-left">
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-1 text-gray-500">Start your health journey today</p>
      </div>

      <form onSubmit={handleRegister} className="mt-8 space-y-6">
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
          className="w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
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
        className="w-full flex justify-center items-center gap-2 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 48 48">
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          ></path>
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          ></path>
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          ></path>
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          ></path>
        </svg>
        {isGoogleLoading ? "Signing up..." : "Sign up with Google"}
      </button>
    </div>
  );
}
