import {DataTypes, Model} from "sequelize";
import createSequelizeInstance from './databaseServiceOrm';

const createListing = () => {
    const sequelize = createSequelizeInstance();
    
    class Listing extends Model {
        public id!: number;
        public marketplace!: string;
        public asinId!: number;
    }

    Listing.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        marketplace: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },
        asinId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    }, {
        sequelize,
        tableName: 'listing',
        timestamps: true,
    });
    
    return Listing;
}

export default createListing;
