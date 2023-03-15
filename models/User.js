const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
});

UserSchema.pre("save", async function (next) {
  //this salt is the number of random bytes we'll get
  //bigger the number more secure is the password
  const salt = await bcrypt.genSalt(10);
  //now we take in those random bytes and pass it onto the
  //hash method along with the password

  this.password = await bcrypt.hash(this.password, salt);
  next();
});
//so every document that we create, we can have functions on them
//we are defining a function that will be accessable
//to all the instances of UserSchema
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {

    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}
//console.log(UserSchema)

module.exports = mongoose.model("User", UserSchema);

//unique creates a unique index
//so if i am trying to save a user but there is already an
//email in use then i will get an duplicate error message
