
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;

    }
    next();
};

const Listing = require("./models/listing");

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    const listing = await Listing.findById(id);

    if(!listing.owner.equals(req.user._id)){
        req.flash("error", "You don't have permission to edit this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
module.exports.validateReview = (req, res, next) => {
    const { comment, rating } = req.body.review;
    if(!comment || !rating){
        req.flash("error", "Comment and rating are required");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
};
module.exports.validateListing = (req, res, next) => {
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        req.flash("error", errMsg);
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
    let {reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review){
        req.flash("error", "Review does not exist");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${req.params.id}`);
    }
    next();
};