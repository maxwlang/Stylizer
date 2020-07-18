// Direct interface to the sequelize initialization options.
const database = {
    dialect: 'sqlite',
    storage: './data/database.db',
    logging: msg => require('../modules/winston').info(msg),
};

module.exports = database;
