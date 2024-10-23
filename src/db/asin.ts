import {DataTypes, Model} from "sequelize";
import createSequelizeInstance from './databaseServiceOrm';

const createAsin = () => {
    const sequelize = createSequelizeInstance();
    
    class Asin extends Model {
        public id!: number;
        public asin!: string;
        public brandId!: string;
    }

    Asin.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        asin: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },
        brandId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    }, {
        sequelize,
        tableName: 'asin',
        timestamps: true,
    });
    
    return Asin;
}

export default createAsin;
