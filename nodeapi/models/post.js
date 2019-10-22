const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "Title is required",
    minlength: 5,
    maxlength: 100
  },
  body: {
    type: String,
    required: "Body is required",
    minlength: 5,
    maxlength: 1000
  }
});
module.exports = mongoose.model("Post", postSchema);
