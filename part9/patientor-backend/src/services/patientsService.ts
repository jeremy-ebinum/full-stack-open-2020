import patients from "../../data/patients";
import { NonSensitivePatient } from "../types";

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => {
    return { id, name, dateOfBirth, gender, occupation };
  });
};

export default { getPatients };
