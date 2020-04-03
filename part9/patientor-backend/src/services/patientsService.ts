import patients from "../../data/patients";
import { Patient, NonSensitivePatient, NewPatient } from "../types";
import { v4 as uuid } from "uuid";

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => {
    return { id, name, dateOfBirth, gender, occupation };
  });
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = { ...patient, id: uuid() };
  patients.push(newPatient);
  return newPatient;
};

export default { getPatients, addPatient };
