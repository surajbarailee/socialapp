const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,
  photo: {
    data: Buffer,
    contentType: String
  },
  about: {
    type: String,
    trim: true
  }
});

//virtual field
userSchema
  .virtual("password")
  .set(function(password) {
    //temporary variable banako to salt the password and save as hashed password
    this.pass_word = password;

    //timestamp generate gareko
    this.salt = uuidv1();

    //encryption of password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this.pass_word;
  });

userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "password hashing was unsuccessful";
    }
  }
};

module.exports = mongoose.model("User", userSchema);
