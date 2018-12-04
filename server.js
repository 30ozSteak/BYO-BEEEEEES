const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./routes/db");
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());
app.use("/", db);

app.listen(app.get("port"), () => {
  console.log(`${app.name} is running on ${app.get("port")}.`);
});

module.exports = app;
