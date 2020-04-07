import { State } from "./state";
import { Patient, Diagnosis } from "../types";

export type Action =
  | { type: "SET_PATIENT_LIST"; payload: Patient[] }
  | { type: "ADD_PATIENT"; payload: Patient }
  | { type: "UPDATE_PATIENT"; payload: Patient }
  | { type: "SET_DIAGNOSIS_LIST"; payload: Diagnosis[] };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients,
        },
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case "UPDATE_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: {
            ...state.patients[action.payload.id],
            ...action.payload,
          },
        },
      };
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses,
        },
      };
    default:
      return state;
  }
};

export const setPatientList = (patients: Patient[]): Action => {
  return { type: "SET_PATIENT_LIST", payload: patients };
};

export const addPatient = (newPatient: Patient): Action => {
  return { type: "ADD_PATIENT", payload: newPatient };
};

export const updatePatient = (patient: Patient): Action => {
  return { type: "UPDATE_PATIENT", payload: patient };
};

export const setDiagnosisList = (diagnoses: Diagnosis[]): Action => {
  return { type: "SET_DIAGNOSIS_LIST", payload: diagnoses };
};
