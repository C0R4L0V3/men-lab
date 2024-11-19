const bcrypt = require("bcrypt");
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

//==routes top and renders sign-up page==
router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});

//===================================================================================

//==Account Creation==
router.post('/sign-up', async (req,res) => {
//For our app to be secure and functional, we need to make the following considerations:

// Usernames need to be unique: two people can’t share the same username!
// The password and confirmPassword fields must match to verify there were no typos.
// Passwords cannot be stored directly as plain-text in the database, this is not secure.

//checks if the username already exsists
const userInDatabase = await User.findOne({ username: req.params.username });
if (userInDatabase) {
    return res.send("Username already taken");
}
//compares and validates if passwords match
if ( req.body.password !== req.body.confirmPassword){
    // console.log(req.body);
    return res.send('Passwords do not match');
}

//hashes and salts password in database, 10 represents the if salting we want the hashing function to execute, higher number, hard to decrypt but equals longer response time
const hashedPassword = bcrypt.hashSync(req.body.password, 10);
req.body.password = hashedPassword

//creates new user
const user = await User.create(req.body);
// res.send(`Thanks for signing up ${user.username}`);

//logins user after sign up
req.session.user = {
    username: userInDatabase.username,
};

req.session.save(() => {
    res.redirect('/');
})

});

//===================================================================================

//==Routes to and renders sign-in page ==
router.get('/sign-in', (req, res) => {
    res.render('auth/sign-in.ejs');
});

//==Account sign-in

router.post('/sign-in', async (req,res) => {

    try {
    
        //confirms if user exsists by seeing if a key value matchs the username body field
        const userInDatabase = await User.findOne({username: req.body.username});
        //shorthand if the username exsists in the database, 
        // shorthand for "if (userInDatabase === null)"
            if(!userInDatabase) {
                return res.send("No Username matches.");
            }
            //compares and validates if the encrypted stored password is equal to the one in the body field
            const validatePassword = bcrypt.compareSync(
                req.body.password,
                userInDatabase.password
            );
            //shorthand for "if (validatePassword === false)"
            if (!validatePassword) {
                return res.send ("Incorrect Password")
            }

        //
        req.session.user = {
            _id: userInDatabase._id,
            username: userInDatabase.username,
        };
    
        req.session.save(() => {
            res.redirect('/');
        })

        //if correct username and password is used a session is made
        //advoid storing the password, even in the hases format, in the session
        //if there is the other data you want to save to the 'req.session.user', do so here!
       
        // res.send("Request to sign in recieved!");
    } catch (error) {
       console.log(error);   
    }

});

//===================================================================================

//==Account sign out ==

// we need to remove the session attached to the req object, using the built in method destroy
router.get('/sign-out', (req, res) => {
    // res.send('The User wants out!');
    req.session.destroy(() =>{ 
        res.redirect('/');
    });
});

//====================================================================================

//routes to user settings 
router.get('auth/:userId/settings', async (req, res) => {

    try {  
        const userId = req.params.userId
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).send('User not found')
        }

        res.render('auth/settings.ejs', { userId: userId });
    } catch (error) {
        console.error(err);
        res.status(500).send('Internal Server Error')
    }
});


router.put('/auth/:userId', async (req, res) => {

    try {
        const userInDatabase = await User.findOne({username: req.params.username})
            if (userInDatabase){
                return res.send('Usernmae Taken')
            }
            if (req.body.password !== req.body.confirmPassword){
                return res.send('Passwords do not match')
            }
    } catch (error){
        console.log(error);
        
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;

   await User.findByIdAndUpdate(req.params.userId, req.body)

    // res.send('Account Settings updated')
    res.redirect(`/`)

    // auth/${re.params.userId}

})

// /:userID

module.exports = router;