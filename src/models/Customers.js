import Sequelize from "sequelize";
import connection from '../config/db.js';


const Customer = connection.define('customers',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    phone_no: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    offer_count: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 0
    },
    recount_after_offer: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    }, 
    purchase_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    cumulative_amount_after_offer: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 0
    },
    cumulative_amount_total: {
        type: Sequelize.STRING,
        allowNull: true,
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


export { Customer }