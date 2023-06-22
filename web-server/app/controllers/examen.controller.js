const db = require("../models");
const Examen = db.examen;
const User = db.user;
const Disciplina = db.disciplina;
const Sala = db.sala;
const Profesor = db.profesor;
const Sequelize = require("sequelize");
const SENDMAIL = require("../mailer/mail");
const HTML_TEMPLATE = require("../mailer/mail-template");
const Op = Sequelize.Op;
// Create and Save a new Examen
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.nume || !req.body.disciplinaId || !req.body.salaId) {
    res.status(400).send({
      message: "Content can not be empty and needs to be linked to a disciplina and sala!"
    });
    return;
  }

  // Create a Examen
  let exam = {
    nume: req.body.nume,
    an: req.body.an,
    sectie: req.body.sectie,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    disciplinaId: req.body.disciplinaId,
    salaId: req.body.salaId,
    tip: req.body.tip,
    prezentare: req.body.prezentare,
    creatorId: req.body.creatorId
  };

  let profesorEmail;
  Disciplina.findOne(
      { where: { id: req.body.disciplinaId } ,
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
      }
  ).then(data => {
      profesorEmail = data.profesor.user.email;
  }).catch(err => {
      res.status(500).send({
        message:
          "Some error occurred while getting profesor's email" + err.message
      });
  });

  // Save Sala in the database
   Examen.create(exam)
    .then(data => {
      res.send(data);
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const message = `Buna ziua, un examen a fost programat pentru anul ${req.body.an}, sectia ${req.body.sectie} in data de: ${new Date(req.body.startDate).toLocaleDateString('ro-RO', dateOptions)}. Va rugam verificati calendarul de pe site pentru mai multe detalii.`
      const options = {
          from: "condretroxana144a@gmail.com",
          // to: profesorEmail,
          to: "condretroxana144a@gmail.com",
          subject: "Programare examen",
          text: message,
          html: HTML_TEMPLATE(message),
      }
      SENDMAIL(options);
    })
    .catch(err => {
      res.status(500).send({
        message:
          "Some error occurred while creating the Examen." + err.message
      });
    });
};

// Retrieve all Examen from the database.
exports.findAll = (req, res) => {
    Examen.findAll({
        include: [
          {
            model: Disciplina,
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
          },
          {
            model: Sala
          }
        ]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving exams."
        });
      });
};
// Retrieve all Examen from the database by sala
exports.findAllBySali = (req, res) => {
    const sali = req.query.sali;
    Examen.findAll({
        include: [
          {
            model: Disciplina,
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
          },
          {
            model: Sala,
            where: { id: { [Op.in]: sali.split(",")}},
          }
        ]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving exams."
        });
      });
};

// Find a single Sala with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Examen.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Examen with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Examen with id=" + id
        });
    });

};

// Update a Examen by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Examen.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num === 1) {
        res.send({
          message: "Examen was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Examen with id=${id}. Maybe Examen was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Examen with id=" + id
      });
    });
};

// Get one by name
exports.findOneByName = (req, res) => {
   const name = req.params.name;

    Examen.findAll({
        where: {
            nume: {
              [Op.like]: `%${name}%`
            }
        }
    })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Examen with name=${name}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Examen with id=" + name
        });
    });
};

// Delete a Examen with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Examen.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num === 1) {
          res.send({
            message: "Examen was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Examen with id=${id}. Maybe Sala was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Examen with id=" + id
        });
      });
};

// Find all exams for a specific admin
exports.findAllFutureExamsForAnAdmin = async (req, res) => {
  const userId = req.params.id;

  const user = await User.findByPk(userId);

   if (!user) {
    return;
   }

  const exams =  await Examen.findAll({
    where: {
      startDate: {
          [Op.gte]: new Date()
      }
    },
    include: [
      {
        model: Disciplina,
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
      },
      {
        model: Sala
      }
    ]
  });

   let examList = [];
   if (exams) {
    exams.map(exam => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      examList.push({
        disciplina: exam.disciplina.nume,
        prezentare: exam.prezentare,
        sala: exam.sala.nume,
        tip: exam.tip,
        data: exam.startDate.toLocaleDateString('ro-RO', options),
        ora: `${exam.startDate.getUTCHours() + 3}:${exam.startDate.getMinutes().toString().padStart(2, '0')}`,
        profesor: `${exam.disciplina.profesor.user.nume} ${exam.disciplina.profesor.user.prenume}`,
      })
    })
    res.send(examList);
   } else {
       res.status(404).send({
           message: `Cannot find any exams for this use`
       });
   }
}

// Find all not scheduled exams for a specific admin
exports.findAllExamsUnscheduledForAnAdmin = async (req, res) => {
  const userId = req.params.id;

  const user = await User.findByPk(userId);

   if (!user) {
    return;
   }

  const exams = await Examen.findAll({
    include: [
      {
        model: Disciplina,
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
      }
    ]
  });

   const disciplineWithExamsScheduled = exams.map(exam => exam.disciplina.id);
   const discipline = await Disciplina.findAll(
       {
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
       }
   );
   const disciplineWithoutExamsScheduled = discipline.filter(disciplina => !disciplineWithExamsScheduled.includes(disciplina.id));

   if (disciplineWithoutExamsScheduled) {
    res.send(disciplineWithoutExamsScheduled);
   } else {
       res.status(404).send({
           message: `Cannot find any exams for this use`
       });
   }
}


// Find all exams for a specific user
exports.findAllFutureExamsForAnUser = async (req, res) => {
  const userId = req.params.id;

  const user = await User.findByPk(userId);

   if (!user) {
    return;
   }

  const exams =  await Examen.findAll({
    where: {
      an: user.an,
      sectie: user.sectie,
      startDate: {
          [Op.gte]: new Date()
      }
    },
    include: [
      {
        model: Disciplina,
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
      },
      {
        model: Sala
      }
    ]
  });

   let examList = [];
   if (exams) {
    exams.map(exam => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      examList.push({
        disciplina: exam.disciplina.nume,
        prezentare: exam.prezentare,
        sala: exam.sala.nume,
        tip: exam.tip,
        data: exam.startDate.toLocaleDateString('ro-RO', options),
        ora: `${exam.startDate.getUTCHours() + 3}:${exam.startDate.getMinutes().toString().padStart(2, '0')}`,
        profesor: `${exam.disciplina.profesor.user.nume} ${exam.disciplina.profesor.user.prenume}`,
      })
    })
    res.send(examList);
   } else {
       res.status(404).send({
           message: `Cannot find any exams for this use`
       });
   }
}

// Find all not scheduled exams for a specific user
exports.findAllExamsUnscheduledForAnUser = async (req, res) => {
  const userId = req.params.id;

  const user = await User.findByPk(userId);

   if (!user) {
    return;
   }

  const exams = await Examen.findAll({
    where: {
      an: user.an,
      sectie: user.sectie,
    },
    include: [
      {
        model: Disciplina,
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
      }
    ]
  });

   const disciplineWithExamsScheduled = exams.map(exam => exam.disciplina.id);
   const discipline = await Disciplina.findAll(
       {
           where: {
               an: user.an,
               sectie: user.sectie,
           },
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
       }
   );
   const disciplineWithoutExamsScheduled = discipline.filter(disciplina => !disciplineWithExamsScheduled.includes(disciplina.id));

   if (disciplineWithoutExamsScheduled) {
    res.send(disciplineWithoutExamsScheduled);
   } else {
       res.status(404).send({
           message: `Cannot find any exams for this use`
       });
   }
}


// Find all exams for a specific profesor
exports.findAllFutureExamsForAProfesor = async (req, res) => {
  const profesorId = req.params.id;

  const user = await User.findByPk(profesorId);

   if (!user) {
    return;
   }

  const exams = await Examen.findAll({
    where: {
      an: user.an,
      sectie: user.sectie,
      startDate: {
          [Op.gte]: new Date()
      }
    },
    include: [
      {
        model: Disciplina,
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
      },
      {
        model: Sala
      }
    ]
  });

   let examList = [];
   if (exams) {
    exams.filter(e => e.disciplina.profesor.user.id === parseInt(profesorId)).map(exam => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      examList.push({
        disciplina: exam.disciplina.nume,
        prezentare: exam.prezentare,
        sala: exam.sala.nume,
        tip: exam.tip,
        data: exam.startDate.toLocaleDateString('ro-RO', options),
        ora: `${exam.startDate.getUTCHours() + 3}:${exam.startDate.getMinutes().toString().padStart(2, '0')}`,
        profesor: `${exam.disciplina.profesor.user.nume} ${exam.disciplina.profesor.user.prenume}`,
      })
    })
    res.send(examList);
   } else {
       res.status(404).send({
           message: `Cannot find any exams for this use`
       });
   }
}

// Find all not scheduled exams for a specific profesor
exports.findAllExamsUnscheduledForAProfesor = async (req, res) => {
  const profesorId = req.params.id;

  const user = await User.findByPk(profesorId);

   if (!user) {
    return;
   }

  const exams = await Examen.findAll({
    where: {
      an: user.an,
      sectie: user.sectie,
    },
    include: [
      {
        model: Disciplina,
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
      }
    ]
  });

   const disciplineWithExamsScheduled = exams.filter(e => e.disciplina.profesor.user.id === parseInt(profesorId)).map(exam => exam.disciplina.id);
   const discipline = await Disciplina.findAll(
       {
           where: {
               an: user.an,
               sectie: user.sectie,
           },
           include: [
                {
                    model: Profesor,
                    where: {
                        userId: profesorId
                    },
                    include: [
                        {
                            model: User
                        }
                    ]
                }
           ]
       }
   );
   const disciplineWithoutExamsScheduled = discipline.filter(disciplina => !disciplineWithExamsScheduled.includes(disciplina.id));

   if (disciplineWithoutExamsScheduled) {
    res.send(disciplineWithoutExamsScheduled);
   } else {
       res.status(404).send({
           message: `Cannot find any exams for this use`
       });
   }
}