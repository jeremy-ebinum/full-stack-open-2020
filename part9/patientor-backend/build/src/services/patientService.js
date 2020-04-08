"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../../data/patients"));
const uuid_1 = require("uuid");
let savedPatients = [...patients_1.default];
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const findById = (id) => {
    const patient = savedPatients.find((p) => p.id === id);
    return patient;
};
const getPatients = () => {
    return savedPatients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => {
        return { id, name, dateOfBirth, gender, occupation, entries };
    });
};
const addPatient = (patient) => {
    const newPatient = Object.assign(Object.assign({}, patient), { id: uuid_1.v4(), entries: [] });
    savedPatients = savedPatients.concat(newPatient);
    return newPatient;
};
const addEntry = (patient, newEntry) => {
    const entry = Object.assign(Object.assign({}, newEntry), { id: uuid_1.v4() });
    const savedPatient = Object.assign(Object.assign({}, patient), { entries: patient.entries.concat(entry) });
    savedPatients = savedPatients.map((p) => p.id === savedPatient.id ? savedPatient : p);
    return savedPatient;
};
exports.default = { getPatients, addPatient, findById, addEntry };
