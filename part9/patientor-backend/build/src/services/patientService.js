"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../../data/patients"));
const uuid_1 = require("uuid");
const getPatients = () => {
    return patients_1.default.map(({ id, name, dateOfBirth, gender, occupation, entries }) => {
        return { id, name, dateOfBirth, gender, occupation, entries };
    });
};
const addPatient = (patient) => {
    const newPatient = Object.assign(Object.assign({}, patient), { id: uuid_1.v4(), entries: [] });
    patients_1.default.push(newPatient);
    return newPatient;
};
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const findById = (id) => {
    const patient = patients_1.default.find((p) => p.id === id);
    return patient;
};
exports.default = { getPatients, addPatient, findById };
