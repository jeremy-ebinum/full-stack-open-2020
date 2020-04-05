"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/utils");
const patientsData_json_1 = __importDefault(require("./patientsData.json"));
const patients = patientsData_json_1.default.map((object) => {
    const patient = utils_1.toNewPatient(object);
    patient.id = object.id;
    patient.entries = [];
    return patient;
});
exports.default = patients;
