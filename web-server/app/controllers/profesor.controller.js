const db = require("../models");
const User = db.user;
const Profesor = db.profesor;

// Retrieve all Profesors from the database.
exports.findAll = (req, res) => {
    Profesor.findAll({
        include: [
            {
                model: User,
            }
        ]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving professors."
        });
      });
};