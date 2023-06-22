module.exports = app => {
  const sali = require("../controllers/sala.controller.js");

  var router = require("express").Router();

  app.use('/sali', router);

  // Create a new sala
  router.post("/create", sali.create);

  // Retrieve all sali
  router.get("/", sali.findAll);

  // Retrieve a single sala with id
  router.get("/:id", sali.findOne);

  // Update a sala with id
  router.put("/:id", sali.update);

  // Delete a sala with id
  router.delete("/:id", sali.delete);

};