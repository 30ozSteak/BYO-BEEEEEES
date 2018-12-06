const express = require("express");
const app = express();

app.set("port", process.env.PORT || 3000);

app.use(express.json());

app.get('/api/v1/locations', (request, response) => {
  response.status(200).send('');
});

app.listen(app.get("port"), () => {
  console.log(`${app.name} is running on ${app.get("port")}.`);
});

module.exports = app;
