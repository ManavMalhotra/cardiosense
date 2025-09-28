"use client";

import { useState } from "react";
import { ref, set, remove } from "firebase/database";
import { db } from "@/lib/firebase";
import Link from "next/link";

// 🔑 Helper to generate RFID-style IDs like "HRID23789"
function generatePatientId() {
  const prefix = "HRID";
  const num = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${num}`;
}

type Patient = {
  id: string;
  name: string;
  dob?: string;
  gender?: string;
  height_cm?: string;
  weight_kg?: string;
};

type DoctorDashboardProps = {
  patients: Patient[];
};

export default function DoctorDashboard({ patients }: DoctorDashboardProps) {
  const [adding, setAdding] = useState(false);

  const handleAddPatient = async () => {
    setAdding(true);
    try {
      const patientId = generatePatientId();
      const newPatient: Patient = {
        id: patientId,
        name: "New Patient",
        dob: "",
        gender: "",
        height_cm: "",
        weight_kg: "",
      };

      await set(ref(db, `patients/${patientId}`), newPatient);
      alert(`Patient added with ID: ${patientId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to add patient.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemovePatient = async (id: string) => {
    if (!confirm("Remove this patient?")) return;
    try {
      await remove(ref(db, `patients/${id}`));
      alert("Patient removed successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to remove patient.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Doctor Dashboard</h1>

      {/* Patient List Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Individuals / Patients</h2>
          <button
            onClick={handleAddPatient}
            disabled={adding}
            className="px-6 py-3 rounded-md bg-[#3B82F6] text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add Patient"}
          </button>
        </div>

        {patients.length === 0 ? (
          <p className="text-gray-500">No patients found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {patients.map((p) => (
              <li
                key={p.id}
                className="flex justify-between items-center py-3 hover:bg-gray-50 px-2 rounded"
              >
                {/* Clicking patient redirects to /patient/[id] */}
                <Link
                  href={`/patient/${p.id}`}
                  className="flex flex-col cursor-pointer"
                >
                  <span className="font-medium text-gray-800">{p.name}</span>
                  <span className="text-sm text-gray-500">{p.id}</span>
                </Link>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleRemovePatient(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
