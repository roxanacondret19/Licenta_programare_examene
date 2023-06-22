const users = require("../controllers/user.controller");
module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  app.use('/users', router);

  // Create a new User
  router.post("/register", users.register);

  router.post("/login", users.login);

  router.get("/user", users.getUser);

  router.get("/an/:an/sectie/:sectie", users.getUserByAnAndSectie);

  // Retrieve all Users
  router.get("/", users.findAll);

  // Retrieve a single User with id 
  router.get("/:id", users.findOne);

  // Update a User with id
  router.put("/:id", users.update);

  // Delete a User with id
  router.delete("/:id", users.delete);

};