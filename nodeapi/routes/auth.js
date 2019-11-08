const express = require("express");
const {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  socialLogin
} = require("../controllers/auth");
const { userSignupValidator, passwordResetValidator } = require("../validator");
const { userById } = require("../controllers/user");

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator, resetPassword);
router.post("/social-login", socialLogin);

router.get("/signout", signout);

//any router containing :userid ,app will first execute userbyID method
router.param("userId", userById);

module.exports = router;
