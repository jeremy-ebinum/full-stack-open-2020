"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patientService_1 = __importDefault(require("../services/patientService"));
const utils_1 = require("../utils");
const router = express_1.Router();
router.get("/", (_req, res) => {
    res.json(patientService_1.default.getPatients());
});
router.get("/:id", (req, res) => {
    const patient = patientService_1.default.findById(req.params.id);
    if (patient) {
        res.json(patient);
    }
    else {
        res.sendStatus(404);
    }
});
router.post("/", (req, res) => {
    try {
        const newPatient = utils_1.toNewPatient(req.body);
        const addedPatient = patientService_1.default.addPatient(newPatient);
        res.json(addedPatient);
    }
    catch (e) {
        res.status(400).send({ error: e.message });
    }
});
router.post("/:id/entries", (req, res) => {
    const patient = patientService_1.default.findById(req.params.id);
    if (patient) {
        try {
            const newEntry = utils_1.toNewEntry(req.body);
            const updatedPatient = patientService_1.default.addEntry(patient, newEntry);
            res.json(updatedPatient);
        }
        catch (e) {
            res.status(400).send({ error: e.message });
        }
    }
    else {
        res.status(404).send({ error: "Sorry, this patient does not exist" });
    }
});
exports.default = router;
