export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Entry {}

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  occupation: string;
  gender: Gender;
  dateOfBirth: string;
  entries: Entry[];
}

export type NewPatient = Omit<Patient, "id" | "entries">;

export type NonSensitivePatient = Omit<Patient, "ssn">;

export type PublicPatient = Omit<Patient, "ssn" | "entries">;

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}
