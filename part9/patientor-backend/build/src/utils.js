"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const types_1 = require("./types");
const isString = (text) => {
    return typeof text === "string" || text instanceof String;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const isGender = (param) => {
    return Object.values(types_1.Gender).includes(param);
};
const isArrayOfEntries = (param) => {
    const hasInvalidEntry = param.some((entry) => {
        return !Object.values(types_1.EntryType).includes(entry.type);
    });
    return !hasInvalidEntry;
};
exports.parseToString = (param, paramName) => {
    if (!param || !isString(param)) {
        throw new Error(`Incorrect or missing ${paramName}: ${param}`);
    }
    return param;
};
const parseGender = (gender) => {
    if (!gender || !isString(gender) || !isGender(gender.toLowerCase())) {
        throw new Error(`Incorrect or missing gender: ${gender}`);
    }
    return gender.toLowerCase();
};
const parseDateOfBirth = (dateOfBirth) => {
    if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
        throw new Error(`Incorrect or missing dateOfBirth: ${dateOfBirth}`);
    }
    return dateOfBirth;
};
exports.parseEntries = (entries) => {
    if (!entries || !Array.isArray(entries) || !isArrayOfEntries(entries)) {
        throw new Error(`Incorrect or missing entries: ${JSON.stringify(entries)}`);
    }
    return entries;
};
exports.toNewPatient = (object) => {
    return {
        name: exports.parseToString(object.name, "name"),
        occupation: exports.parseToString(object.occupation, "occupation"),
        gender: parseGender(object.gender),
        ssn: exports.parseToString(object.ssn, "ssn"),
        dateOfBirth: parseDateOfBirth(object.dateOfBirth),
    };
};
