const express = require("express");
const app = express();
const router = express.Router();



//index - users
router.get("/", (req, res) => {
    res.send("GET for users");
});
router.get("/:id", (req, res) => {
    res.send("GET for show users");
});

router.post("/", (req, res) => {
    res.send("POST for users");
});
router.delete("/:id", (req, res) => {
    res.send("DELETE for show users");
});

module.exports = router;