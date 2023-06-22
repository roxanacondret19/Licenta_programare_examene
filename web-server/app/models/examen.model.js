const { sectieTypes } = require("../constants/SectieConstants.js");
const { prezentareTypes } = require("../constants/PrezentareConstants.js");
const { tipTypes } = require("../constants/TipConstants.js");

module.exports =  (sequelize, DataTypes) => {
  const Examen = sequelize.define("examen", {
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
    prezentare: {
      allowNull: false,
      defaultValue: prezentareTypes.P1,
      type: DataTypes.ENUM([prezentareTypes.P1, prezentareTypes.P2, prezentareTypes.P3, prezentareTypes.P4])
    },
    tip: {
      allowNull: false,
      defaultValue: tipTypes.EXAMEN,
      type: DataTypes.ENUM([tipTypes.EXAMEN, tipTypes.DISTRIBUITA1, tipTypes.DISTRIBUITA2, tipTypes.PARTIAL])
    },
    startDate: {
      type: DataTypes.DATE
    },
    endDate: {
      type: DataTypes.DATE
    },
  });

  return Examen;
};