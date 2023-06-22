const examene = require("../controllers/examen.controller");
module.exports = app => {
  const examene = require("../controllers/examen.controller.js");

  var router = require("express").Router();

  app.use('/examene', router);

  // Create a new exam
  router.post("/create", examene.create);

  // Retrieve all exams
  router.get("/", examene.findAll);

  // Retrieve all exams
  router.get("/sali", examene.findAllBySali);

  //Retrieve all exams scheduled for a specific profesor
  router.get("/profesor/:id/programate/viitoare", examene.findAllFutureExamsForAProfesor);

  //Retrieve all exams not scheduled for a specific profesor
  router.get("/profesor/:id/neprogramate", examene.findAllExamsUnscheduledForAProfesor);

  //Retrieve all exams scheduled for a specific admin
  router.get("/admin/:id/programate/viitoare", examene.findAllFutureExamsForAnAdmin);

  //Retrieve all exams not scheduled for a specific admin
  router.get("/admin/:id/neprogramate", examene.findAllExamsUnscheduledForAnAdmin);

  //Retrieve all exams scheduled for a specific user
  router.get("/user/:id/programate/viitoare", examene.findAllFutureExamsForAnUser);

  //Retrieve all exams not scheduled for a specific user
  router.get("/user/:id/neprogramate", examene.findAllExamsUnscheduledForAnUser);

  // Retrieve a single exam with id
  router.get("/:id", examene.findOne);

  // Retrieve a single exam by name
  router.get("/name/:name", examene.findOneByName);

  // Update a exam with id
  router.patch("/edit/:id", examene.update);

  // Delete a exam with id
  router.delete("/:id", examene.delete);

};