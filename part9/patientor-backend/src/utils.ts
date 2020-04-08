/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Diagnosis,
  NewPatient,
  Gender,
  EntryType,
  HealthCheckRating,
  SickLeave,
  Discharge,
  NewBaseEntry,
  NewEntry,
} from "./types";

/**
 * Helper function for exhaustive type checking
 */
export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const isString = (text: any): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const isArrayOfStrings = (param: any[]): param is string[] => {
  const hasNonString = param.some((item) => {
    return !isString(item);
  });

  return !hasNonString;
};

export const parseToString = (param: any, paramName: string): string => {
  if (!param || !isString(param)) {
    throw new Error(`Incorrect or missing ${paramName}: ${param || ""}`);
  }
  return param;
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isString(gender) || !isGender(gender.toLowerCase())) {
    throw new Error(`Incorrect or missing gender: ${gender || ""}`);
  }
  return gender.toLowerCase() as Gender;
};

const parseToDate = (param: any, paramName: string): string => {
  if (!param || !isString(param) || !isDate(param)) {
    throw new Error(`Incorrect or missing ${paramName}: ${param || ""}`);
  }
  return param;
};

const parseEntryType = (entryType: any): EntryType => {
  if (!Object.values(EntryType).includes(entryType)) {
    throw new Error(`Incorrect or missing type: ${entryType || ""}`);
  }

  return entryType;
};

const parseDiagnosesCodes = (diagnosisCodes: any): Array<Diagnosis["code"]> => {
  if (!Array.isArray(diagnosisCodes) || !isArrayOfStrings(diagnosisCodes)) {
    throw new Error("Incorrect or missing diagnoses");
  }

  return diagnosisCodes;
};

export const toNewPatient = (object: any): NewPatient => {
  return {
    name: parseToString(object.name, "name"),
    occupation: parseToString(object.occupation, "occupation"),
    gender: parseGender(object.gender),
    ssn: parseToString(object.ssn, "social security number"),
    dateOfBirth: parseToDate(object.dateOfBirth, "date of birth"),
  };
};

const toNewBaseEntry = (object: any): NewBaseEntry => {
  const newBaseEntry: NewBaseEntry = {
    type: parseEntryType(object.type),
    description: parseToString(object.description, "description"),
    date: parseToDate(object.date, "date"),
    specialist: parseToString(object.specialist, "specialist"),
  };

  if (object.diagnosisCodes) {
    newBaseEntry.diagnosisCodes = parseDiagnosesCodes(object.diagnosisCodes);
  }

  return newBaseEntry;
};

const parseHealthCheckRating = (healthCheckRating: any): HealthCheckRating => {
  if (
    healthCheckRating === null ||
    healthCheckRating === undefined ||
    !isHealthCheckRating(healthCheckRating)
  ) {
    throw new Error(
      `Incorrect or missing health check rating: ${healthCheckRating || ""}`
    );
  }
  return healthCheckRating;
};

const parseSickLeave = (object: any): SickLeave => {
  if (!object) throw new Error("Missing sick leave");

  return {
    startDate: parseToDate(object.startDate, "sick leave start date"),
    endDate: parseToDate(object.endDate, "sick leave end date"),
  };
};

const parseDischarge = (object: any): Discharge => {
  if (!object) throw new Error("Missing discharge");

  return {
    date: parseToDate(object.date, "discharge date"),
    criteria: parseToString(object.criteria, "discharge criteria"),
  };
};

export const toNewEntry = (object: any): NewEntry => {
  const newBaseEntry = toNewBaseEntry(object) as NewEntry;

  switch (newBaseEntry.type) {
    case EntryType.HealthCheck:
      return {
        ...newBaseEntry,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
      };
    case EntryType.OccupationalHealthCare:
      const newEntry = {
        ...newBaseEntry,
        employerName: parseToString(object.employerName, "employer name"),
      };

      if (object.sickLeave) {
        newEntry.sickLeave = parseSickLeave(object.sickLeave);
      }

      return newEntry;
    case EntryType.Hospital:
      return { ...newBaseEntry, discharge: parseDischarge(object.discharge) };
    default:
      return assertNever(newBaseEntry);
  }
};
