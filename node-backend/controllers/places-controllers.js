const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const Place = require("../models/place");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "empire state building",
    descrption: "state building is a very simple state building",
    location: {
      lat: 40.4,
      lng: 73.98,
    },
    address: "HOuse no 57 adarsh magar dasuya",
    creator: "u1",
  },
  {
    id: "p1",
    title: "empire state building",
    descrption: "state building is a very simple state building",
    location: {
      lat: 40.4,
      lng: 73.98,
    },
    address: "HOuse no 57 adarsh magar dasuya",
    creator: "u1",
  },
];

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  console.log(userId);
  Place.find({ creator: userId })
    .then((response) => {
      if (response.length > 0) {
        res.json(200, {
          places: response.map((place) => place.toObject({ getters: true })),
        });
      } else {
        res.json(200, { message: "No Places Found" });
      }
    })
    .catch((err) => {
      const error = new HttpError(`No item found for ${userId} user id.`, 404);
      next(error);
    });
};

const getPlacesByPlacesId = async (req, res, next) => {
  const placeId = req.params.pid;
  const error = new HttpError(`No item found for ${placeId} place id.`, 404);
  Place.findById(placeId)
    .exec()
    .then((result) => {
      res.status(200).json({ place: result.toObject({ getters: true }) });
    })
    .catch((err) => {
      next(error);
    });
};

const createPlaces = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.errors);

  if (errors.errors.length > 0) {
    const errorField = errors.errors.map((error) => error.path);
    const errorMessage = new HttpError(
      `Please enter a valid values for ${errorField.toString()}`,
      422
    );
    next(errorMessage);
  }

  const { title, description, location, address, creator } = req.body;

  const createdPlace = new Place({
    title,
    description,
    location,
    address,
    creator,
    image:
      "https://images.pexels.com/photos/2224861/pexels-photo-2224861.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  });

  // you can use unshift to add the place at the beginning of the array
  createdPlace
    .save()
    .then((response) => {
      res.status(201).json({ createPlace: response });
    })
    .catch((err) => {
      next(new HttpError(err._message, 404));
    });
};

const patchPlaces = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.errors);

  if (errors.errors.length > 0) {
    const errorField = errors.errors.map((error) => error.path);
    const errorMessage = new HttpError(
      `Please enter a valid values for ${errorField.toString()}`,
      422
    );
    throw errorMessage;
  }

  const { title, description } = req.body;
  const placesId = req.params.pid;

  const foundIndex = DUMMY_PLACES.findIndex((place) => place.id === placesId);

  const updatePlace = {
    title,
    description,
  };

  DUMMY_PLACES[foundIndex] = { ...DUMMY_PLACES[foundIndex], ...updatePlace };

  res.status(201).json(DUMMY_PLACES);
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  const indexOfPlace = DUMMY_PLACES.findIndex((place) => place.id === placeId);
  if (indexOfPlace < 0) {
    throw new HttpError("we could not find the place you want to delete", 404);
  }
  DUMMY_PLACES.splice(indexOfPlace, 1);
  res.status(201).json(DUMMY_PLACES);
};

module.exports = {
  getPlacesByUserId,
  getPlacesByPlacesId,
  createPlaces,
  patchPlaces,
  deletePlace,
};
