const express = require("express");
const app = express();
const router = express.Router();


router.get("/", (req, res) => {
    res.send("GET for post");
});
router.get("/:id", (req, res) => {
    res.send("GET for show posts");
});

router.post("/", (req, res) => {
    res.send("POST for posts");
});
router.delete("/:id", (req, res) => {
    res.send("DELETE for show posts");
});

module.exports = router;
