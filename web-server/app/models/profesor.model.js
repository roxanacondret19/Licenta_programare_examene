module.exports =  (sequelize, DataTypes) => {
    const Profesor = sequelize.define("profesor", {
        grad: {
            type: DataTypes.STRING
        }
    });

    return Profesor;
};