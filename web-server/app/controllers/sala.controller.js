const db = require("../models");
const Sala = db.sala;

// Create and Save a new Sala
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.nume) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const existingSala = await Sala.findAll({ where: { nume: req.body.nume } })
    if (existingSala.length > 0) {
        res.status(400).send({
            message: "Sala already exists!"
        });
        return;
    }

  // Create a Sala
  let sala = {
    nume: req.body.nume,
    nrLocuri: req.body.nrLocuri,
  };

  // Save Sala in the database
   Sala.create(sala)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          "Some error occurred while creating the Sala." + err.message
      });
    });
};

// Retrieve all Sala from the database.
exports.findAll = (req, res) => {
    Sala.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving salas."
        });
      });
};

// Find a single Sala with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Sala.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Sala with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Sala with id=" + id
        });
    });

};

// Update a Sala by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Sala.update(req.body, {
    where: { id }
  })
    .then(num => {
      if (num === 1) {
        res.send({
          message: "Sala was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Sala with id=${id}. Maybe Sala was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Sala with id=" + id
      });
    });
};

// Delete a Sala with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Sala.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num === 1) {
          res.send({
            message: "Sala was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Sala with id=${id}. Maybe Sala was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Sala with id=" + id
        });
      });
};
