import { Router } from "express";
import diagnosisService from "../services/diagnosisService";

const router = Router();

router.get("/", (_req, res) => {
  res.json(diagnosisService.getDiagnoses());
});

export default router;
