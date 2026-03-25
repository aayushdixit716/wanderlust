const express = require("express");
const app = express();
const users = require("./routes/users.js");
const posts = require("./routes/posts.js");
const cookieParser = require("cookie-parser");
app.use(cookieParser("secretcode"));
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
// app.use(session({secret: "mysupersecretstring"}));

// app.get("/test", (req, res) =>{
//     res.send("test successful");
// });
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
};
app.use(session(sessionOptions));
app.use(flash());
app.get("/register", (req, res) => {
    let { name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "name is required");
    }else{
        req.flash("success", "welcome to the site");
    }
    // res.send(`welcome ${name}`);
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.render("page", { name: req.session.name, msg: req.flash("success") });
});
// app.get("/reqcount", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     } else{//ye 24 se 31 tk code session me count naam ka variable bana dega aur usme 1 store kar dega
// //usse jb bhi user request karega to count variable ki value 1 se badh jayegi
//         req.session.count = 1;
//     }
//      res.send(`you sent a request ${req.session.count} times`);
// });



// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("made-in", "India", {signed: true });
//     res.send("signed cookie sent");
// });

// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("verified");
// });
// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "hello");
//     res.send("sent you some cookies");
// })
// app.get("/", (req, res) => {
//     console.log(req.cookies);
//     res.send("hi, i am robot!");
// });
// app.use("/users", users);
// app.use("/posts", posts);

app.listen(3000, () => {
    console.log("app is listening");
});


