const dotenv = require('dotenv'); // requires paackage
dotenv.config(); // loads enviroment
const express = require('express'); //requires express package
const app = express();


const mongoose = require('mongoose'); // require mongoosedb package
const methodOverride = require('method-override');
const morgan = require('morgan');

//ternary for port location
const port = process.env.PORT ? process.env.PORT : '3000';

//connects to the Mongo DB using the connection string in the .emv file
mongoose.connect(process.env.MONGODB_URI);
// log the connection status on terminal start
mongoose.connection.on('connected', () =>{
    console.log(`Connected to MongoDB' ${mongoose.connection.name}`);
})

//middleware to parse URL-encoded date from forms
app.use(express.urlencoded({ extended: false}));
//Middleware for using HTTPs verb such as Put or DELETE
app.use(methodOverride('_method'));
//Morgan for logging HTTP requests 
app.use(morgan('dev'));


app.get('/', (req,res) => {
    console.log('test');
    
    res.render('home.ejs');
});

























app.listen(port, () =>{
    console.log(`Express app is ready on port ${port}`);
    
});