import { Patient } from "../src/types";
import { toNewPatient } from "../src/utils";
import patientsJson from "./patients.json";

const patients: Patient[] = patientsJson.map((object) => {
  const patient = toNewPatient(object) as Patient;
  patient.id = object.id;
  return patient;
});

export default patients;
