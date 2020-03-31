import express from "express";
import { calculateBmi } from "./calculateBmi";

const app = express();

app.get("/hello", (_req, res) => {
  const htmlResponse = `<p>Hello Full Stack</p>
  <p><strong>BMI Usage:</strong> /bmi?height=180&weight=72</p>`;
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

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
