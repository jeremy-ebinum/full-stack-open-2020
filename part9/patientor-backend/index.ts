import express from "express";
const app = express();
app.use(express.json());

const PORT = 3003;

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
