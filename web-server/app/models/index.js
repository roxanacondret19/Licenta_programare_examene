'use strict';
const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.profesor = require("./profesor.model.js")(sequelize, Sequelize);
db.disciplina = require("./disciplina.model.js")(sequelize, Sequelize);
db.examen = require("./examen.model.js")(sequelize, Sequelize);
db.sala = require("./sala.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);

db.examen.belongsTo(db.user, { foreignKey: "creatorId" });
db.user.hasOne(db.examen, { foreignKey: "creatorId" });

db.profesor.hasMany(db.disciplina, {
  foreignKey: "profesorId"
});
db.examen.belongsTo(db.disciplina, { foreignKey: "disciplinaId" });
db.disciplina.hasMany(db.examen, { foreignKey: "disciplinaId" });
db.disciplina.belongsTo(db.profesor, { foreignKey: "profesorId" });
db.profesor.belongsTo(db.user, { foreignKey: "userId" });
db.sala.hasMany(db.examen, { foreignKey: "salaId" });
db.examen.belongsTo(db.sala, { foreignKey: "salaId" });

module.exports = db;
