require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

//Connecting to DB
mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true }) 
const db = mongoose.connection;

db.on('error', (error)=>console.log(error))
db.once('open', ()=>console.log('Connected to Database'))

app.use(express.json());

const alienRouter = require('./routes/Alien');
app.use('/alien', alienRouter);

//For listening
app.listen(3000,()=>console.log('Server started'));
