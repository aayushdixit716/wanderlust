if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();

}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodoverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const reviews = require("./routes/review.js");
const listings = require("./routes/listing.js");
const Userroute = require("./routes/user.js");
const dburl = process.env.ATLAS_URL; 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodoverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600 // time period in seconds
});

store.on("error", (err) => {
    console.log("Session store error:", err);

});
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    }

};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.get('/fakeUser', async (req, res) => {
    let fakeUser = new User({
        username: "fakeuser",
        email: "fakeuser@example.com"
    });
    

let registeredUser = await User.register(fakeUser, "password");
res.send(registeredUser);
});
async function main(){
    await mongoose.connect(dburl);
}
main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.get('/', (req, res) => {
//     res.send('Hello, World!');
// });
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", Userroute);
//     await sampleListings.save();
//     console.log("Sample listing saved to database");
//     res.send("successfully added sample listing to database");
// });

app.use( (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
    console.log("Error:", err);
    let {statusCode = 500, message = "Something went wrong" } = err;
    // res.send("something went wrong");
    res.render("error.ejs", {message});
    // res.status(statusCode).send(message);
});
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});