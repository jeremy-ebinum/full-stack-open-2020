/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewPatient, Gender, Entry, EntryType } from "./types";

const isString = (text: any): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const isArrayOfEntries = (param: any[]): param is Entry[] => {
  const hasInvalidEntry = param.some((entry) => {
    return !Object.values(EntryType).includes(entry.type);
  });

  return !hasInvalidEntry;
};

export const parseToString = (param: any, paramName: string): string => {
  if (!param || !isString(param)) {
    throw new Error(`Incorrect or missing ${paramName}: ${param}`);
  }
  return param;
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isString(gender) || !isGender(gender.toLowerCase())) {
    throw new Error(`Incorrect or missing gender: ${gender}`);
  }
  return gender.toLowerCase() as Gender;
};

const parseDateOfBirth = (dateOfBirth: any): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error(`Incorrect or missing dateOfBirth: ${dateOfBirth}`);
  }
  return dateOfBirth;
};

export const parseEntries = (entries: any): Entry[] => {
  if (!entries || !Array.isArray(entries) || !isArrayOfEntries(entries)) {
    throw new Error(`Incorrect or missing entries: ${JSON.stringify(entries)}`);
  }
  return entries;
};

export const toNewPatient = (object: any): NewPatient => {
  return {
    name: parseToString(object.name, "name"),
    occupation: parseToString(object.occupation, "occupation"),
    gender: parseGender(object.gender),
    ssn: parseToString(object.ssn, "ssn"),
    dateOfBirth: parseDateOfBirth(object.dateOfBirth),
  };
};
