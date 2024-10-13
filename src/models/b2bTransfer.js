import Sequelize from "sequelize";
import connection from '../config/db.js';


const B2bTransfer = connection.define('b2bTransfer',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    conversational_id: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    partyA: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    partyB: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    amount: {
      type: Sequelize.STRING,
      allowNull: true,
    }, 
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    }, 
    transaction_reference: {
        type: Sequelize.STRING,
        allowNull: true,
    }, 
    result_desc: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    payload: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    uuid: {
        type: Sequelize.STRING,
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


export { B2bTransfer }