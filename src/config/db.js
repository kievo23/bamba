import 'dotenv/config'
import express from 'express'
import { Sequelize } from 'sequelize';

console.log("DB: "+process.env.POSTGRES_DATABASE)
console.log("USERNAME: "+process.env.POSTGRES_USERNAME)
console.log("Password: "+process.env.POSTGRES_PASSWORD)

const connection = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST || 'db',
    //host: 'db',
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