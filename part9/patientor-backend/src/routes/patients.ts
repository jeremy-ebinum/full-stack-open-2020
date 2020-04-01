import { Router } from "express";
import patientsService from "../services/patientsService";

const router = Router();

router.get("/", (_req, res) => {
  res.json(patientsService.getPatients());
});

export default router;
