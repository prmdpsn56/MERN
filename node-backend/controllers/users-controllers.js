const HttpError = require('../models/http-error')
const uuid = require('uuid')
const User = require('../models/user');
const { validationResult } = require('express-validator');
const user = require('../models/user');


const signUpController = async (req, res, next) => {
  const errors = validationResult(req);
  const { name, email, password, image } = req.body;
  // eslint-disable-next-line no-console
  console.log(req.body);
  const createdUser = new User({ name, email, password, image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D", places: [] });

  if (errors.errors.length > 0) {
    const errorField = errors.errors.map((error) => error.path)
    const errorMessage = new HttpError(
      `Please enter a valid value for ${errorField.toString()}`,
      422
    )
    return next(errorMessage)
  }

  let alreadyThere;
  try {
    alreadyThere = await User.findOne({ email: email });
    if (alreadyThere) {
      // eslint-disable-next-line no-console
      console.log('------------ User already exists information below---------')
      // eslint-disable-next-line no-console
      console.log(alreadyThere);
      // eslint-disable-next-line no-console
      const error = new HttpError(`user ${email} already exists`);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError('Sign up failed for the user, please try again later');
    return next(error);
  }

  try {
    let result = await createdUser.save();
    // eslint-disable-next-line no-console
    res.status(200).json({ user: result.toObject({ getters: true }) })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    const error = new HttpError('Sing up failed for the user,please try again later');
    return next(error);
  }
}

const logInController = async (req, res, next) => {
  const errors = validationResult(req)
  const { email, password } = req.body

  if (errors.errors.length > 0) {
    const errorField = errors.errors.map((error) => error.path)
    const errorMessage = new HttpError(
      `Please enter a valid value for ${errorField.toString()}`,
      422
    )
    return next(errorMessage);
  }


  let exisitngUser;
  try {
    exisitngUser = await User.findOne({ email: email });
    // eslint-disable-next-line no-console
    console.log('------------ User already exists information below---------')
    // eslint-disable-next-line no-console
    console.log(exisitngUser);
    if (exisitngUser.password !== password) {
      return res.status(400).json({ message: "Invalid password Entered" });
    }
  } catch (err) {
    const error = new HttpError('Login failed for the user,please try again later');
    return next(error);
  }

  if (exisitngUser) {
    res.status(200).json({ user: exisitngUser.toObject({ getters: true }) })
  } else {
    return next(new HttpError(`User ${email} not found`, 404));
  }
}

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, '-__v -password ');
    res.status(200).json({ users: users.map(user => user.toObject({ getters: true })) })
  } catch (err) {
    const error = new HttpError('Sing up failed for the user,please try again later');
    return next(error);
  }
}

module.exports = {
  signUpController,
  logInController,
  getUsers,
}
