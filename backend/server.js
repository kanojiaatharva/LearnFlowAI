const express = require("express");
const cors = require("cors");

const explainRoute = require("./routes/explain");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/explain", explainRoute);

app.listen(5000, () =>
  console.log("Server running on port 5000")
);