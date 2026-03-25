const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose').default;// default export of passport-local-mongoose is a function that takes the schema as an argument and adds the necessary fields and methods for authentication

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  }
});
console.log(typeof passportLocalMongoose);
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);