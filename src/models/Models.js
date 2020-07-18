/**
 * Models Model
 * A sequelize table model of the torch "models" table.
 * I know the naming is confusing.
 */
const { DataTypes, } = require('sequelize');

function Models(sequelize) {
    const Models = sequelize.define('Models', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        width: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        height: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        file: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {});

    return {
        Models,
        sequelize,
    };
}

module.exports = Models;
