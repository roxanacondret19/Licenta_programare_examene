module.exports = app => {
  const profesors = require("../controllers/profesor.controller");

  var router = require("express").Router();

  app.use('/profesors', router);

  // Retrieve all profesors
  router.get("/", profesors.findAll);
};