import { Router } from "express";
import patientsService from "../services/patientsService";
import { toNewPatient } from "../utils";

const router = Router();

router.get("/", (_req, res) => {
  res.json(patientsService.getPatients());
});

router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientsService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;
