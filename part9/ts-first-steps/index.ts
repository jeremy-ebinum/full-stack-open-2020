import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { calculateBmi } from "./calculateBmi";
import { calculateExercises } from "./exerciseCalculator";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/hello", (_req, res) => {
  const htmlResponse = `<p>Hello Full Stack</p>
  <p><strong>BMI Usage:</strong> GET /bmi?height=180&weight=72</p>
  <p><strong>exercises Usage:</strong> POST /exercises
  {"dailyExercises": [1, 0, 2, 0, 3, 0, 2.5], "target": 2}</p>`;
  res.send(htmlResponse);
});

app.get("/bmi", (req, res) => {
  const { query } = req;
  let { height, weight } = query;

  if (!height || !weight) {
    return res.status(400).json({ error: "parameters missing" });
  }

  height = Number(height);
  weight = Number(weight);

  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const bmi = calculateBmi(height, weight);

  return res.json({ weight, height, bmi });
});

app.post("/exercises", (req, res) => {
  const { body } = req;
  const { dailyExercises } = body;
  let { target } = body;

  if (!target || !dailyExercises) {
    return res.status(400).json({ error: "parameters missing" });
  }

  if (!Array.isArray(dailyExercises)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const hasNaNInDailyHours = dailyExercises.some((hours) => isNaN(hours));
  target = Number(target);

  if (isNaN(target) || hasNaNInDailyHours) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  return res.json(calculateExercises(dailyExercises, target));
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
