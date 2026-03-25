const User = require("../models/user.js");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.register = async (req, res, next) =>{
    try{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err){
            return next(err);
        }
        else{
        req.flash("success", "Welcome to WanderLust!");
       return res.redirect("/listings");
        }
    })
    
    }catch(e){
        req.flash("error", e.message);
       return res.redirect("/signup");
    }
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You have logged out successfully!");
        res.redirect("/listings");
    });
};