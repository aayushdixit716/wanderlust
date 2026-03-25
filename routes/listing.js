const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing');
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const  listingController  = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); //iska mtlb hai ki uploaded files ko 'uploads/' folder me store karega
    router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.create));
//new route
router.get('/new', isLoggedIn,listingController.renderNewForm); 
     router.route("/:id")
    .get(wrapAsync(listingController.show))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing, wrapAsync( listingController.update))
    .delete(isLoggedIn,isOwner, wrapAsync( listingController.delete));
//edit route
router.get('/:id/edit', isLoggedIn,isOwner,  wrapAsync(listingController.renderEditForm));


module.exports = router;