const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
require("dotenv").config();
//user paila nai registered xa ki xaina herne

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(403).json({
      error: "Email is already taken!"
    });
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ message: " Signup success .Please Login" });
};

exports.signin = (req, res) => {
  //find user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    //check if user email exist
    console.log(user);
    if (err || !user) {
      return res.status(401).json({
        error: "User with email has some error"
      });
    }
    //create auth method in model and used here
    //check if email and password match
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "email and password doesnot match"
      });
    }
    //generate a token with user id and secret

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETKEY);
    //persist the token as t in cookie with expiry date

    res.cookie("tokencookie", token, { expire: new Date() + 9000 });

    //return response with user and token  to front end
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, email, name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("tokencookie");
  return res.status(200).json({ message: "Signout Success!" });
};
exports.requireSignin = expressJWT({
  //if token valid then expressJWT appends the verified users id
  //in an auth key to the request object
  secret: process.env.JWT_SECRETKEY,
  userProperty: "auth"
});
