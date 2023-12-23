import Sequelize from "sequelize";
import connection from '../config/db.js';


const MpesaPurchase = connection.define('mpesa_purchase',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    phone_no: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amount :  {
        type: Sequelize.STRING,
        allowNull: false,
    },
    purchasing_phone: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status:  {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    deleted_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' }
  },{
    timestamps: true, // timestamps will now be true
    underscored: true
  }
);

//User.belongsTo(Company, {foreignKey: 'fk_company'});


export { MpesaPurchase }