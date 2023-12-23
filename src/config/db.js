import express from 'express'
import { Sequelize } from 'sequelize';

const connection = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
    host: '0.0.0.0',
    dialect: 'postgres',
    port: '5432',
  });

connection.authenticate()
    .then(()=>{
        console.log('success : db connection established')
    })
    .catch(err=>{
        console.log('fail : Unable to connect to db\n',err)
    })

connection.sync({
  //force:true
});

export default connection;