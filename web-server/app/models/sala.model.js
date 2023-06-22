module.exports =  (sequelize, DataTypes) => {
    const Sala = sequelize.define("sala", {
        nume: {
            type: DataTypes.STRING
        },
        nrLocuri: {
            type: DataTypes.INTEGER
        }
    });

    return Sala;
};