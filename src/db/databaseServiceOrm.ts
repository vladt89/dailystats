import {Sequelize} from "sequelize";

const createSequelizeInstance = (): Sequelize=> {
    return new Sequelize({
        dialect: 'sqlite',
        storage: 'mydb.sqlite',
        logging: false
    });
}

export default createSequelizeInstance;
