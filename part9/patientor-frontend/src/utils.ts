/* eslint-disable @typescript-eslint/no-explicit-any */
import { Gender, Entry, Patient } from "./types";
import { InvalidPatientError } from "./helpers/errorHelper";

const isString = (text: any): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseString = (param: any, paramName: string): string => {
  if (!param || !isString(param)) {
    throw new InvalidPatientError(
      `Incorrect or missing ${paramName}: ${param}`
    );
  }
  return param;
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isString(gender) || !isGender(gender.toLowerCase())) {
    throw new InvalidPatientError(`Incorrect or missing gender: ${gender}`);
  }
  return gender.toLowerCase() as Gender;
};

const parseDateOfBirth = (dateOfBirth: any): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new InvalidPatientError(
      `Incorrect or missing dateOfBirth: ${dateOfBirth}`
    );
  }
  return dateOfBirth;
};

const parseEntries = (entries: any): Entry[] => {
  if (!entries || !Array.isArray(entries)) {
    throw new InvalidPatientError(`Incorrect or missing entries: ${entries}`);
  }
  return entries;
};

export const toPatient = (object: any): Patient => {
  return {
    name: parseString(object.name, "name"),
    occupation: parseString(object.occupation, "occupation"),
    gender: parseGender(object.gender),
    ssn: parseString(object.ssn, "ssn"),
    dateOfBirth: parseDateOfBirth(object.dateOfBirth),
    id: parseString(object.id, "id"),
    entries: parseEntries(object.entries),
  };
};
