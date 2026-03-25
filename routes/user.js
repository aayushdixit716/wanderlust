const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const UserController = require("../controllers/user.js");
router.get('/signup', wrapAsync(UserController.renderSignupForm));
router.post("/signup", wrapAsync(UserController.register));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});
router.post("/login",saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}),UserController.login
);

router.get("/logout", UserController.logout);
module.exports = router;