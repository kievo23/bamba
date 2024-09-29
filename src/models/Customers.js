import Sequelize from "sequelize";
import connection from '../config/db.js';


const Customers = connection.define('customers',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    phone_no: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },    
    createdAt: { type: Sequelize.DATE, field: 'created_at' },
    updatedAt: { type: Sequelize.DATE, field: 'updated_at' }
  },{
    timestamps: true, // timestamps will now be true
    underscored: true
  }
);


//User.belongsTo(Company, {foreignKey: 'fk_company'});


export { Customers }