import {DataTypes, Model} from "sequelize";
import createSequelizeInstance from './databaseServiceOrm';

const createBrand = () => {
    const sequelize = createSequelizeInstance();
    
    class Brand extends Model {
        public id!: number;
        public brandName!: string;
    }

    Brand.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        brandName: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },
    }, {
        sequelize,
        tableName: 'brand',
        timestamps: true,
    });
    
    return Brand;
}

export default createBrand;
