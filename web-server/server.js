const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");

const app = express();

var corsOptions = {
  credentials: true,
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

db.sequelize.sync({alter: true})

// set port, listen for requests
const API_PORT = process.env.API_PORT || 8081;
require("./app/routes/user.routes")(app);
require("./app/routes/sala.routes")(app);
require("./app/routes/examen.routes")(app);
require("./app/routes/profesors.routes")(app);
require("./app/routes/disciplina.routes")(app);

app.listen(API_PORT, () => {
  console.log(`Server is running on port ${API_PORT}.`);
});