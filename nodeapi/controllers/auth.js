const User = require("../models/user");
const jwt = require("jsonwebtoken");
const expressJWT = require("express-jwt");
require("dotenv").config();
const _ = require("lodash");
const { sendEmail } = require("../helpers");
// load env

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

// add forgotPassword and resetPassword methods
exports.forgotPassword = (req, res) => {
  if (!req.body) return res.status(400).json({ message: "No request body" });
  if (!req.body.email)
    return res.status(400).json({ message: "No Email in request body" });

  console.log("forgot password finding user with that email");
  const { email } = req.body;
  console.log("signin req.body", email);
  // find the user based on email

  //   •	In forgotPassword method, you will check if the user with that email exists. If not then you will send the error message.
  // •	If that email exists, then you will generate a token and set user model's resetPasswordLink property with the value of token
  // •	Then email that token to the user's email
  // •	Upon clicking on that link, user will be taken to the react frontend app, where we will capture that token which will be available in the route params
  // •	Based on that token we grab from route params (in React app), we will make request to resetPassword (see the resetPassword method below)

  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status("401").json({
        error: "User with that email does not exist!"
      });

    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: "NODEAPI" },
      process.env.JWT_SECRETKEY
    );

    // email data
    const emailData = {
      from: "noreply@node-react.com",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${process.env.CLIENT_URL}/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${process.env.CLIENT_URL}/reset-password/${token}</p>`
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ message: err });
      } else {
        sendEmail(emailData);
        return res.status(200).json({
          message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
        });
      }
    });
  });
};

// to allow user to reset password
// first you will find the user in the database with user's resetPasswordLink
// user model's resetPasswordLink's value must match the token
// if the user's resetPasswordLink(token) matches the incoming req.body.resetPasswordLink(token)
// then we got the right user

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  User.findOne({ resetPasswordLink }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status("401").json({
        error: "Invalid Link!"
      });

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: ""
    };

    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json({
        message: `Great! Now you can login with your new password.`
      });
    });
  });
};

exports.socialLogin = (req, res) => {
  // try signup by finding user with req.email
  let user = User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      // create a new user and login
      user = new User(req.body);
      req.profile = user;
      user.save();
      // generate a token with user id and secret
      const token = jwt.sign(
        { _id: user._id, iss: "NODEAPI" },
        process.env.JWT_SECRET
      );
      res.cookie("tokencookie", token, { expire: new Date() + 9999 });
      // return response with user and token to frontend client
      const { _id, name, email } = user;
      return res.json({ token, user: { _id, name, email } });
    } else {
      // update existing user with new social info and login
      req.profile = user;
      user = _.extend(user, req.body);
      user.updated = Date.now();
      user.save();
      // generate a token with user id and secret
      const token = jwt.sign(
        { _id: user._id, iss: "NODEAPI" },
        process.env.JWT_SECRETKEY
      );
      res.cookie("tokencookie", token, { expire: new Date() + 9999 });
      // return response with user and token to frontend client
      const { _id, name, email } = user;
      return res.json({ token, user: { _id, name, email } });
    }
  });
};
