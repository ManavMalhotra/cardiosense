export interface BaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface PatientUser extends BaseUser {
  role: 'patient';
  patientDataId: string; // The link to the 'patients' node (e.g., "14FAD97B")
}

export interface DoctorUser extends BaseUser {
  role: 'doctor';
  assignedPatients: Record<string, boolean>; // e.g., { "14FAD97B": true }
}

export type User = PatientUser | DoctorUser;
