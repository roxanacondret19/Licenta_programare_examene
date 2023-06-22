module.exports = app => {
  const discipline = require("../controllers/disciplina.controller.js");

  var router = require("express").Router();

  app.use('/discipline', router);

  // Create a new disciplina
  router.post("/create", discipline.create);

  // Retrieve all discipline
  router.get("/", discipline.findAll);

  // Retrieve all discipline by year and sectie
  router.get("/an/:an/sectie/:sectie", discipline.findAllByAnSectie);

  // Retrieve a single disciplina with id
  router.get("/:id", discipline.findOne);

  // Update a disciplina with id
  router.put("/:id", discipline.update);

  // Delete a disciplina with id
  router.delete("/:id", discipline.delete);

};