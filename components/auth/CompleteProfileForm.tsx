"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ref, set } from "firebase/database";
import { auth, db } from "@/lib/firebase";
import type { PatientUser, DoctorUser } from "@/lib/types";

export default function CompleteProfileForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    mobNo: "",
    occupation: "",
    height: "",
    weight: "",
    state: "",
    city: "",
    pincode: "",
    landmark: "",
  });
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const user = auth.currentUser;

  // Pre-fill name if coming from Google Sign-In
  useEffect(() => {
    if (user?.displayName) {
      const nameParts = user.displayName.split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("No authenticated user found. Please log in again.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const displayName = `${formData.firstName} ${formData.lastName}`.trim();

    try {
      const userProfile: PatientUser | DoctorUser =
        role === "patient"
          ? {
              uid: user.uid,
              email: user.email,
              displayName,
              role: "patient",
              patientDataId: `PATIENT_${user.uid.slice(0, 8).toUpperCase()}`, // This can be your own logic
              profile: formData, // Storing all extra details here
            }
          : {
              uid: user.uid,
              email: user.email,
              displayName,
              role: "doctor",
              assignedPatients: {},
              profile: formData,
            };

      await set(ref(db, `users/${user.uid}`), userProfile);

      // We need to manually refresh the token to make sure AuthProvider re-evaluates
      // This is a bit of a trick to force a state update
      await user.getIdToken(true);
      window.location.href = "/dashboard"; // Force a full reload to re-run AuthProvider logic cleanly
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      setIsLoading(false);
    }
  };

  if (!user) {
    // You can show a loading state or a message here
    return <div>Loading user information...</div>;
  }

  // All the JSX for the large form goes here
  return (
    <div className="rounded-lg border bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">
        Complete your profile
      </h1>
      <p className="mt-1 text-gray-500">Please enter your details</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
      >
        {/* Input fields for firstName, lastName, gender, etc. using the `formData` state and `handleChange` */}
        {/* Example for one field: */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm"
          />
        </div>
        {/* ... Add all other text input fields in the same pattern ... */}

        <div className="sm:col-span-2">
          <p className="text-sm font-medium text-gray-700">
            Please select registration type
          </p>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label
              htmlFor="patient-role"
              className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                role === "patient"
                  ? "border-blue-600 ring-2 ring-blue-600"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="role"
                id="patient-role"
                value="patient"
                checked={role === "patient"}
                onChange={() => setRole("patient")}
                className="sr-only"
              />
              <span className="flex flex-1">
                <span className="flex flex-col">
                  <span className="block text-sm font-medium text-gray-900">
                    I'm an individual / patient
                  </span>
                </span>
              </span>
            </label>
            <label
              htmlFor="doctor-role"
              className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                role === "doctor"
                  ? "border-blue-600 ring-2 ring-blue-600"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="role"
                id="doctor-role"
                value="doctor"
                checked={role === "doctor"}
                onChange={() => setRole("doctor")}
                className="sr-only"
              />
              <span className="flex flex-1">
                <span className="flex flex-col">
                  <span className="block text-sm font-medium text-gray-900">
                    I'm a specialist / doctor
                  </span>
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full justify-center rounded-md border border-transparent bg-blue-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
