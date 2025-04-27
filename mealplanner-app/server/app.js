import "dotenv/config";
import express from "express";
import cors from "cors";
import mongodb from "./db/connection.js";

import users from "./api/routes/users.js";
import mealplans from "./api/routes/mealplans.js";
import meals from "./api/routes/meals.js";

const app = express();
const PORT = 8080;

const options = { exposeHeader: ["Authorization"] };
app.use(cors(options));

app.use(express.json());

app.use("/users", users);
app.use("/mealplans", mealplans);
app.use("/meals", meals);

app.listen(PORT, async () => {
  await mongodb.connect();
  console.log(`Server is running on http://localhost:${PORT}`);
});
