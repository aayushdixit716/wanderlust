const express = require("express");
const app = express();
const path = require("path");

const port = 8080;

app.use(express.static(path.join(__dirname, "/public/js")));
app.use(express.static(path.join(__dirname, "/public/css")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
    res.render("home.ejs");//this is to attach any other file and run on browser.
});
app.get("/hello", (req, res) => {
    res.send("hello");
});   
app.get("/ig/:username", (req, res) => {
    // const followers = ["avc","fdf", "tee", "gjd"];
    let { username } = req.params;
    // console.log(username);
    const instaData = require("./data.json");
    const data = instaData[username];
    console.log(data);
    res.render("instagram.ejs", { data }); //code from 16 to 20 print "this page belongs to useraname" on the browser when we call it by nodemon index.ejs.
});

app.get("/rolldice", (req, res) => {
    let diceVal = Math.floor(Math.random() * 6) + 1;
    res.render("rolldice.ejs", { num: diceVal });
});


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});  //this code is for applying ejs