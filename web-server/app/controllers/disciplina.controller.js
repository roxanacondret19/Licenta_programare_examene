const db = require("../models");
const Disciplina = db.disciplina;
const User = db.user;
const Profesor = db.profesor;

// Create and Save a new Disciplina
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.nume || !req.body.profesorId) {
    res.status(400).send({
      message: "Content can not be empty and need to be linked to a professor!"
    });
    return;
  }

  const existingDisciplina = await Disciplina.findAll({ where: { nume: req.body.nume } })
    if (existingDisciplina.length > 0) {
        res.status(400).send({
            message: "Disciplina already exists!"
        });
        return;
    }

  // Create a Disciplina
  let disciplina = {
    nume: req.body.nume,
    an: req.body.an,
    sectie: req.body.sectie,
    profesorId: req.body.profesorId
  };

  // Save Disciplina in the database
   Disciplina.create(disciplina)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          "Some error occurred while creating the Disciplina." + err.message
      });
    });
};

// Retrieve all Disciplinas from the database.
exports.findAll = (req, res) => {
    Disciplina.findAll({
        include: [
            {
                model: Profesor,
                include: [
                    {
                        model: User
                    }
                ]
            }
        ]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving disciplinas."
        });
      });
};

// Retrieve all Disciplinas from the database by an and sectie.
exports.findAllByAnSectie = (req, res) => {
    const an = req.params.an;
    const sectie = req.params.sectie;
    Disciplina.findAll({ where: { an: an, sectie: sectie }})
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving disciplinas."
        });
      });
};

// Find a single Disciplina with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Disciplina.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Disciplina with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Disciplona with id=" + id
        });
    });

};

// Update a Disciplina by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Disciplina.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num === 1) {
        res.send({
          message: "Disciplina was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Disciplina with id=${id}. Maybe Disciplina was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Disciplina with id=" + id
      });
    });
};

// Delete a Disciplina with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Disciplina.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num === 1) {
          res.send({
            message: "Disciplina was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Disciplina with id=${id}. Maybe Disciplina was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Disciplina with id=" + id
        });
      });
};
