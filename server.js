
const dotenv = require('dotenv'); // requires paackage
dotenv.config(); // loads enviroment
const express = require('express'); //requires express package
const app = express();


const mongoose = require('mongoose'); // require mongoosedb package
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // stores internal memory in db
const isSignedIn = require('./middleware/is-signed-in.js'); //<<-- pulls and paths to function
const passUserToView = require('./middleware/pass-user-to-view.js') // paths to function

//routes to the router
const authController = require('./controllers/auth.js');

//ternary for port location
const port = process.env.PORT ? process.env.PORT : '3000';

//connects to the Mongo DB using the connection string in the .emv file
mongoose.connect(process.env.MONGODB_URI);
// log the connection status on terminal start
mongoose.connection.on('connected', () =>{
    console.log(`Connected to MongoDB' ${mongoose.connection.name}`);
});

//== Middleware stack ==
//middleware to parse URL-encoded date from forms
app.use(express.urlencoded({ extended: false}));
//Middleware for using HTTPs verb such as Put or DELETE
app.use(methodOverride('_method'));
//Morgan for logging HTTP requests 
app.use(morgan('dev'));


//randomly generates cookie string
//uses ASCII coding to generate random characters

const generateCookie = (length) => {
    let cookie = ''
    const randomNum = (min, max) => {
        const minNum = Math.ceil(min)
        const maxNum = Math.floor(max)
        return Math.floor(Math.random() * (maxNum + minNum) + minNum)
    };

    for (let i = 0; i < length; i++){
        let char = String.fromCharCode(randomNum(33, 122))
        cookie += char
    }

    return cookie;
    console.log(cookie);
};

const cookie = generateCookie(30)

//cookies middleware

app.use(
    session({
        secret: cookie,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
        }),
    })
);

//custom middleware right after session middleware
app.use(passUserToView);


//instructs express to use the authcontroller for handling requests that match the /auth url pattern
app.use('/auth', authController)



app.get('/', (req,res) => {
    console.log('test');
    
    res.render('index.ejs', {
        //if it works properly, this will not be needed
        // user: req.session.user,
    });
});


// add handler function directly to the input.
app.get('/vip-lounge', isSignedIn, (req, res) => {
    // if (req.session.user) {
        res.send(`Welcome to the party ${req.session.user.username}.`);
    // } else {
    //     res.send("Sorry, no guests allowed.")
    // }
})

app.get('/MyStuff', (req, res) => {
    res.send('My Stuff')
})



























app.listen(port, () =>{
    console.log(`Express app is ready on port ${port}`);
    
});