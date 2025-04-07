import express from "express";
import cors from "cors";
import cities from "./data/cities.json";
import schools_1 from "./data/schools-1.json";
import schools_2 from "./data/schools-2.json";
import form from "./data/form.json";
import { buildSchema, validaTeSchool } from "./validation";
import { SafeParseReturnType } from "zod";

const app = express();
const port = 9000;

app.use(express.json());
app.use(cors());

app.get("/cities", (req, res) => {
  res.json(cities);
});

app.get("/form", (req, res) => {
  res.json(form);
});

app.get("/schools/:id", (req, res) => {
  const cityId = parseInt(req.params.id);
  if (cityId === 1) {
    res.json(schools_1);
  }
  if (cityId === 2) {
    res.json(schools_2);
  }
});

app.post("/submit", (req, res) => {
  const data: Record<string, { _errors: string[] } | undefined> = {};
  for (let key of Object.keys(buildSchema())) {
    if (!req.body[key]) {
      data[key] = { _errors: ["Please Insert this field"] };
      continue;
    }
    const parseResult = buildSchema()[key]?.safeParse(req.body[key]);
    console.log(key, parseResult?.success);
    if (!parseResult?.success) {
      const formatted = parseResult?.error.format();

      data[key] = formatted;
    }
    if (typeof req.body["school"] !== "string") {
      const chosenSchool = req.body["school"];
      const chosenCity = req.body["city"];
      console.log(chosenCity);

      const schools = [];
      if (chosenCity === 1) {
        schools.push(...schools_1);
      }
      if (chosenCity === 2) {
        schools.push(...schools_2);
      }
      const school = schools.find((s) => s.id === chosenSchool);

      if (!school) {
        data["school"] = { _errors: ["Invalid school"] };
      }
    }
  }
  res.json(data);
});
// console.log(validaTeSchool());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
