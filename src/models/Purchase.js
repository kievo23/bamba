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
        allowNull: true,
    },
    transaction_amount :  {
        type: Sequelize.STRING,
        allowNull: true,
    },
    airtime_amount :  {
        type: Sequelize.STRING,
        allowNull: true,
    },
    airtime_discount :  {
        type: Sequelize.STRING,
        allowNull: true,
    },
    purchasing_phone: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    transaction_time : {
        type: Sequelize.TIME,
        allowNull: true,
    },
    transaction_type : {
        type: Sequelize.STRING,
        allowNull: true,
    },
    transaction_uuid : {
        type: Sequelize.STRING,
        allowNull: true,
    },
    transaction_reference: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    airtime_payload: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    merchant_request_i_d:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    mpesa_result_desc:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    status:  {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    airtime_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    mpesa_payload: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    indexes: [
        { fields: ['phone_no'] },
        { fields: ['transaction_uuid'] },
        { fields: ['transaction_reference'] },
        { fields: ['merchant_request_i_d'] },
        { fields: ['createdAt'] },
        { fields: ['transaction_uuid', 'merchant_request_i_d'] }
      ],
    timestamps: true, // timestamps will now be true
    underscored: true
  }
);

//User.belongsTo(Company, {foreignKey: 'fk_company'});


export { MpesaPurchase }