const passUserToView = (req, res, next) => {
    // if the User is signed in, we assign the value to res.locals.user the value of re.session.user.
    //else, the res.locals. user the value is null
    //shorthand
    res.locals.user = req.session.user ? req.session.user : null;
    next();
}

module.exports = passUserToView;