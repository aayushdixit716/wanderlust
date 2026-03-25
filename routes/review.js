const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require('../models/listing');
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/review.js");
    router.post("/",isLoggedIn, validateReview, wrapAsync(ReviewController.create));
    
    router.delete(
        "/:reviewId",
        isLoggedIn,
        isReviewAuthor,
        wrapAsync(ReviewController.delete)
    );

    module.exports = router;