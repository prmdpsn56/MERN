const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const usersController = require("../controllers/users-controllers");

router.get("/", usersController.getUsers);
router.post(
  "/signup",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signUpController
);
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.logInController
);

module.exports = router;
