const HttpError = require("../models/http-error");
const uuid = require("uuid");
const { validationResult } = require("express-validator");

const DUMMY_USERS = [
  {
    id: 1,
    name: "Paramdeep Singh",
    email: "singhparamdeep@gmail.com",
    pass: "test",
  },
];

const signUpController = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.errors.length > 0) {
    const errorField = errors.errors.map((error) => error.path);
    const errorMessage = new HttpError(
      `Please enter a valid value for ${errorField.toString()}`,
      422
    );
    throw errorMessage;
  }

  const { name, email, password } = req.body;

  const alreadyThere = DUMMY_USERS.find((user) => user.email === email);

  if (!!alreadyThere) {
    res.status(200).json({
      message: `user with email ${email} already exists, Please try a new email`,
    });
  }

  const createdUser = {
    id: uuid.v4(),
    email,
    name,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(200).json(DUMMY_USERS);
};

const logInController = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.errors.length > 0) {
    const errorField = errors.errors.map((error) => error.path);
    const errorMessage = new HttpError(
      `Please enter a valid value for ${errorField.toString()}`,
      422
    );
    throw errorMessage;
  }

  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);

  if (identifiedUser) {
    res.status(200).json(identifiedUser);
  } else {
    throw new HttpError("User not found", 404);
  }
};

const getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
  console.log("logInController");
};

module.exports = {
  signUpController,
  logInController,
  getUsers,
};
