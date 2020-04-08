import patients from "../../data/patients";
import {
  Patient,
  NonSensitivePatient,
  NewPatient,
  Entry,
  NewEntry,
} from "../types";
import { v4 as uuid } from "uuid";

let savedPatients = [...patients];

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const findById = (id: any): Patient | undefined => {
  const patient = savedPatients.find((p) => p.id === id);
  return patient;
};

const getPatients = (): NonSensitivePatient[] => {
  return savedPatients.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) => {
      return { id, name, dateOfBirth, gender, occupation, entries };
    }
  );
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = { ...patient, id: uuid(), entries: [] as Entry[] };
  savedPatients = savedPatients.concat(newPatient);
  return newPatient;
};

const addEntry = (patient: Patient, newEntry: NewEntry): Patient => {
  const entry: Entry = { ...newEntry, id: uuid() };
  const savedPatient = { ...patient, entries: patient.entries.concat(entry) };
  savedPatients = savedPatients.map((p) =>
    p.id === savedPatient.id ? savedPatient : p
  );

  return savedPatient;
};

export default { getPatients, addPatient, findById, addEntry };
