"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import PatientDashboard from "@/components/PatientDashboard";

type Patient = {
  id: string;
  name: string;
  dob?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  reports?: any[];
};

export default function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchPatient = async () => {
      try {
        const snapshot = await get(ref(db, `patients/${id}`));
        if (snapshot.exists()) {
          setPatient({ id, ...snapshot.val() });
        }
      } catch (err) {
        console.error("Error fetching patient:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!patient)
    return <div className="p-6 text-red-500">Patient not found</div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Patient Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Patient Details</h2>
        <p>
          <strong>ID:</strong> {patient.id}
        </p>
        <p>
          <strong>Name:</strong> {patient.name}
        </p>
        <p>
          <strong>DOB:</strong> {patient.dob || "Not set"}
        </p>
        <p>
          <strong>Gender:</strong> {patient.gender || "Not set"}
        </p>
        <p>
          <strong>Height:</strong> {patient.height_cm || "Not set"} cm
        </p>
        <p>
          <strong>Weight:</strong> {patient.weight_kg || "Not set"} kg
        </p>
      </div>

      {/* Patient Dashboard */}
      <PatientDashboard />
    </div>
  );
}
