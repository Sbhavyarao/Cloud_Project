//import the modules
var express = require('express');
const xoauth2 = require('xoauth2');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

var path = require('path');
var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false})
);
mongoose.connect('mongodb+srv://bhavya:bhavya1234@cluster0-vwglj.mongodb.net/ASE?retryWrites=true&w=majority')
    .then(() => console.log('connection successful'))
    .catch((err) => console.error(err));

var apiRouter = require('./Routes/route');
app.use('/api', apiRouter);

const port = 3000;

app.listen(port,()=>{
    console.log('server started at port '+ port);
});
