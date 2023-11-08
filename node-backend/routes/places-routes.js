const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const placesController = require("../controllers/places-controllers");

router.get("/:pid", placesController.getPlacesByPlacesId);

router.get("/user/:uid", placesController.getPlacesByUserId);

router.post(
  "/",
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 1, max: 100 }),
  ],
  placesController.createPlaces
);

router.patch(
  "/:pid",
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5, max: 100 }),
  ],
  placesController.patchPlaces
);

router.delete("/:pid", placesController.deletePlace);

module.exports = router;
