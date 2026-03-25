 const Listing = require('../models/listing');
 
 module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index', { allListings });
};
 module.exports.renderNewForm =  (req, res) => {
    res.render('listings/new');

};

module.exports.show = async (req, res) => {
    console.log("params ID:", req.params.id);
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    
        }).populate("owner");
    if(!listing){
        req.flash("error", "Cannot find that listing");
        return res.redirect("/listings");
    }
    console.log("db result:", listing);
    res.render('listings/show', { listing });
};
const axios = require("axios");

module.exports.create = async (req, res) => {

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // ✅ LOCATION → COORDINATES (OpenStreetMap Nominatim)
    const location = req.body.listing.location;

    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
            q: location,
            format: "json"
        },
        headers: {
            "User-Agent": "wanderlust-app (your@email.com)"
        }
    });

    if (geoRes.data.length > 0) {
        const lat = geoRes.data[0].lat;
        const lon = geoRes.data[0].lon;

        newListing.geometry = {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)]
        };
    } else {
        // fallback (agar location na mile)
        newListing.geometry = {
            type: "Point",
            coordinates: [80.9462, 26.8467]
        };
    }

    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {url, filename};
    }

    await newListing.save();
    req.flash("success", "Successfully created a new listing");
    res.redirect('/listings');
};
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    
    if(!listing){
        req.flash("error", "Cannot find that listing");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300,h_300");

res.render('listings/edit', { listing, originalImageUrl });
};
module.exports.update = async (req, res) => {
    let {id} = req.params;

    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, { new: true });

    const axios = require("axios");
    const location = req.body.listing.location;

    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
        q: location,
        format: "json"
    },
    headers: {
        "User-Agent": "wanderlust-app (your@email.com)"
    }
});

    if (geoRes.data.length > 0) {
        const lat = geoRes.data[0].lat;
        const lon = geoRes.data[0].lon;

        listing.geometry = {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)]
        };
    }

    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
    }

    await listing.save();

    req.flash("success", "Successfully updated the listing");
    res.redirect(`/listings/${id}`);
};
module.exports.delete = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}
