"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const types_1 = require("./types");
/**
 * Helper function for exhaustive type checking
 */
exports.assertNever = (value) => {
    throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};
const isString = (text) => {
    return typeof text === "string" || text instanceof String;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const isGender = (param) => {
    return Object.values(types_1.Gender).includes(param);
};
const isHealthCheckRating = (param) => {
    return Object.values(types_1.HealthCheckRating).includes(param);
};
const isArrayOfStrings = (param) => {
    const hasNonString = param.some((item) => {
        return !isString(item);
    });
    return !hasNonString;
};
exports.parseToString = (param, paramName) => {
    if (!param || !isString(param)) {
        throw new Error(`Incorrect or missing ${paramName}: ${param || ""}`);
    }
    return param;
};
const parseGender = (gender) => {
    if (!gender || !isString(gender) || !isGender(gender.toLowerCase())) {
        throw new Error(`Incorrect or missing gender: ${gender || ""}`);
    }
    return gender.toLowerCase();
};
const parseToDate = (param, paramName) => {
    if (!param || !isString(param) || !isDate(param)) {
        throw new Error(`Incorrect or missing ${paramName}: ${param || ""}`);
    }
    return param;
};
const parseEntryType = (entryType) => {
    if (!Object.values(types_1.EntryType).includes(entryType)) {
        throw new Error(`Incorrect or missing type: ${entryType || ""}`);
    }
    return entryType;
};
const parseDiagnosesCodes = (diagnosisCodes) => {
    if (!Array.isArray(diagnosisCodes) || !isArrayOfStrings(diagnosisCodes)) {
        throw new Error("Incorrect or missing diagnoses");
    }
    return diagnosisCodes;
};
exports.toNewPatient = (object) => {
    return {
        name: exports.parseToString(object.name, "name"),
        occupation: exports.parseToString(object.occupation, "occupation"),
        gender: parseGender(object.gender),
        ssn: exports.parseToString(object.ssn, "social security number"),
        dateOfBirth: parseToDate(object.dateOfBirth, "date of birth"),
    };
};
const toNewBaseEntry = (object) => {
    const newBaseEntry = {
        type: parseEntryType(object.type),
        description: exports.parseToString(object.description, "description"),
        date: parseToDate(object.date, "date"),
        specialist: exports.parseToString(object.specialist, "specialist"),
    };
    if (object.diagnosisCodes) {
        newBaseEntry.diagnosisCodes = parseDiagnosesCodes(object.diagnosisCodes);
    }
    return newBaseEntry;
};
const parseHealthCheckRating = (healthCheckRating) => {
    if (healthCheckRating === null ||
        healthCheckRating === undefined ||
        !isHealthCheckRating(healthCheckRating)) {
        throw new Error(`Incorrect or missing health check rating: ${healthCheckRating || ""}`);
    }
    return healthCheckRating;
};
const parseSickLeave = (object) => {
    if (!object)
        throw new Error("Missing sick leave");
    return {
        startDate: parseToDate(object.startDate, "sick leave start date"),
        endDate: parseToDate(object.endDate, "sick leave end date"),
    };
};
const parseDischarge = (object) => {
    if (!object)
        throw new Error("Missing discharge");
    return {
        date: parseToDate(object.date, "discharge date"),
        criteria: exports.parseToString(object.criteria, "discharge criteria"),
    };
};
exports.toNewEntry = (object) => {
    const newBaseEntry = toNewBaseEntry(object);
    switch (newBaseEntry.type) {
        case types_1.EntryType.HealthCheck:
            return Object.assign(Object.assign({}, newBaseEntry), { healthCheckRating: parseHealthCheckRating(object.healthCheckRating) });
        case types_1.EntryType.OccupationalHealthCare:
            const newEntry = Object.assign(Object.assign({}, newBaseEntry), { employerName: exports.parseToString(object.employerName, "employer name") });
            if (object.sickLeave) {
                newEntry.sickLeave = parseSickLeave(object.sickLeave);
            }
            return newEntry;
        case types_1.EntryType.Hospital:
            return Object.assign(Object.assign({}, newBaseEntry), { discharge: parseDischarge(object.discharge) });
        default:
            return exports.assertNever(newBaseEntry);
    }
};
