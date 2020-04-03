"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/utils");
const patients_json_1 = __importDefault(require("./patients.json"));
const patients = patients_json_1.default.map((object) => {
    const patient = utils_1.toNewPatient(object);
    patient.id = object.id;
    return patient;
});
exports.default = patients;
