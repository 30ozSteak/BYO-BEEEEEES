const express = require("express");
const app = express();

app.set("port", process.env.PORT || 3000);

app.use(express.json());

app.get("/api/v1/locations", (request, response) => {
  const testArray = [1, 2, 3, 4, 5];
  response.status(200).json(testArray);
});

app.get("/api/v1/locations/:id", (request, response) => {
  response.status(200).send();
});

app.post("/api/v1/locations", (request, response) => {
  const location = request.body;

  if (location.name && location.abbr && location.count) {
    response.status(201).send({ message: `Location ${location.name} added.` });
  } else {
    response.status(422).send({
      message:
        "Your request body was not correct. Please send the following format: {name: <String>, abbr: <String>, count: <Integer>}"
    });
  }
});

app.listen(app.get("port"), () => {
  console.log(`${app.name} is running on ${app.get("port")}.`);
});

module.exports = app;
