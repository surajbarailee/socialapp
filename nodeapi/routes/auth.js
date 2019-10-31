const express = require("express");
const { signup, signin, signout } = require("../controllers/auth");
const { userSignupValidator } = require("../validator");
const { userById } = require("../controllers/user");

const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);

router.get("/signout", signout);

//any router containing :userid ,app will first execute userbyID method
router.param("userId", userById);

module.exports = router;
