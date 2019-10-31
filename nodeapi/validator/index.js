exports.createPostValidator = (req, res, next) => {
  req.check("title", "Write a title").notEmpty();
  req.check("title", "Title must be between 4 to 150 characters").isLength({
    min: 5,
    max: 100
  });
  req.check("body", "Write a Body").notEmpty();
  req.check("body", "Body must be between 5 to 1000 characters").isLength({
    min: 5,
    max: 1000
  });
  //errors checking
  const errors = req.validationErrors();
  //if error show the first one at they happens
  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  //continue to next middleware
  next();
};

exports.userSignupValidator = (req, res, next) => {
  //name checker: not null 4-10 character
  req.check("name", "Name is required").notEmpty();
  //emailchecker
  req
    .check("email", "Email must be between 3-32 characters")
    .matches(/.+@.+\..+/)
    .withMessage("Email is not valid")
    .isLength({
      min: 5,
      max: 2000
    });

  //check for password
  req.check("password", "Password is required").notEmpty();
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password Must contain a number");

  //errors checking
  const errors = req.validationErrors();
  //if error show the first one at they happens
  if (errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400).json({ error: firstError });
  }
  //continue to next middleware
  next();
};
