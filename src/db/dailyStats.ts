import {DataTypes, Model} from "sequelize";
import createSequelizeInstance from './databaseServiceOrm';

const createDailyStats = () => {
    const sequelize = createSequelizeInstance();
    
    class DailyStats extends Model {
        public id!: number;
        public clickAmount!: number;
        public viewTimeSec!: number;
        public listingId!: number;
    }

    DailyStats.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        clickAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        viewTimeSec: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        listingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        tableName: 'dailyStats',
        timestamps: true,
    });
    
    return DailyStats;
}

export default createDailyStats;
