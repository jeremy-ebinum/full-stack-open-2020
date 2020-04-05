import patients from "../../data/patients";
import { Patient, NonSensitivePatient, NewPatient } from "../types";
import { v4 as uuid } from "uuid";

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) => {
      return { id, name, dateOfBirth, gender, occupation, entries };
    }
  );
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = { ...patient, id: uuid(), entries: [] };
  patients.push(newPatient);
  return newPatient;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const findById = (id: any): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);
  return patient;
};

export default { getPatients, addPatient, findById };
