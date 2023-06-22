const { roleTypes } = require("../constants/RoleConstants.js");
const { sectieTypes } = require("../constants/SectieConstants");

module.exports =  (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    nume: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prenume: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parola: {
      type: DataTypes.STRING,
      allowNull: false
    },
    an: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sectie: {
      allowNull: false,
      defaultValue: sectieTypes.IS,
      type: DataTypes.ENUM([sectieTypes.IS, sectieTypes.CTI])
    },
    rol: {
      allowNull: false,
      defaultValue: roleTypes.SEF_AN,
      type: DataTypes.ENUM([roleTypes.SEF_AN, roleTypes.ADMIN, roleTypes.PROFESOR])
    }
  });

  return User;
};