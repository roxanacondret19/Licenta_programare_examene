const db = require("../models");
const { config } = require("../config/config");
const User = db.user;
const Profesor = db.profesor;
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Create and Save a new User
exports.register = async (req, res) => {
  // Validate request
  if (!req.body.nume || !req.body.prenume) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  const existingUsers = await User.findAll({ where: { email: req.body.email } })
    if (existingUsers.length > 0) {
        res.status(400).send({
            message: "User already exists!"
        });
        return;
    }

  // Create a User
  let user = {
    nume: req.body.nume,
    prenume: req.body.prenume,
    email: req.body.email,
    an: req.body.an,
    sectie: req.body.sectie,
    rol: req.body.rol || "Sef_An"
  };
  user.parola = await bcrypt.hash(req.body.parola, 8);

  // Save User in the database
   User.create(user)
    .then(data => {
      res.send(data);
      if (data.rol === "Profesor") {
        Profesor.create({userId: data.id, grad: req.body.grad});
      }
    })
    .catch(err => {
      res.status(500).send({
        message:
          "Some error occurred while creating the User." + err.message
      });
    });
};

let currentUser;
// Create and Save a new User
exports.login = async (req, res) => {
    if(req.body.email.trim() === '' || req.body.parola.trim() === ''){
        return res.status(400).send({ msg:"email or password must not be empty" })
    }

    const existingUsers = await User.findAll({ where: { email: req.body.email } });

    if (existingUsers.length === 0) {
        return res.status(400).send({ msg:"Email or password is incorrect" })
    }

    bcrypt.compare(req.body.parola, existingUsers[0].parola).then(isMatch=> {
        if (isMatch === false) {
            return res.status(401).send({
                msg: "Email or password is incorrect "
            })
        }

        currentUser = existingUsers[0];
        //generate token
        const token = jwt.sign({id: existingUsers[0].id.toString()}, config.jwtSecretKey)
        return res.status(200).send({
            msg: "logged in successfully",
            user: existingUsers[0],
            token
        })
    });
};

exports.getUser = (req, res, next) => { // this function will send user data to the front-end as I said above authFetch on the user object in nuxt.config.js will send a request and it will execute
  res.status(200).json({
    user: {
      id: currentUser.id,
      nume: currentUser.nume,
      prenume:currentUser.prenume,
      email: currentUser.email,
      an: currentUser.an,
      sectie: currentUser.sectie,
      rol: currentUser.rol
    },
  });
};


// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    User.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving users."
        });
      });
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + id
        });
    });

};

// Find a single User by an and sectie
exports.getUserByAnAndSectie = (req, res) => {
    const an = req.params.an;
    const sectie = req.params.sectie;
    User.findOne({
        where: {
            an,
            sectie
        }
    })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find User with an=${an} and sectie=${sectie}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: `Error retrieving User with an=${an} and sectie=${sectie}`
        });
    });

};

// Update a User by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num === 1) {
        res.send({
          message: "Tutorial was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num === 1) {
          res.send({
            message: "User was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
};
