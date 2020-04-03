"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../../data/patients"));
const uuid_1 = require("uuid");
const getPatients = () => {
    return patients_1.default.map(({ id, name, dateOfBirth, gender, occupation }) => {
        return { id, name, dateOfBirth, gender, occupation };
    });
};
const addPatient = (patient) => {
    const newPatient = Object.assign(Object.assign({}, patient), { id: uuid_1.v4() });
    patients_1.default.push(newPatient);
    return newPatient;
};
exports.default = { getPatients, addPatient };
