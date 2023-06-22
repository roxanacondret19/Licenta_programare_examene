const { sectieTypes } = require("../constants/SectieConstants.js");

module.exports = (sequelize, DataTypes) => {
  const Disciplina = sequelize.define("disciplina", {
    nume: {
      type: DataTypes.STRING
    },
    an: {
      type: DataTypes.STRING
    },
    sectie: {
      allowNull: false,
      defaultValue: sectieTypes.IS,
      type: DataTypes.ENUM([sectieTypes.IS, sectieTypes.CTI])
    },
  });

  return Disciplina;
};