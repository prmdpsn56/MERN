const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')
const Place = require('../models/place')

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid
  Place.find({ creator: userId })
    .then((response) => {
      if (response.length > 0) {
        res.json(200, {
          places: response.map((place) => place.toObject({ getters: true })),
        })
      } else {
        res.json(200, { message: 'No Places Found' })
      }
    })
    .catch((err) => {
      const error = new HttpError(`No item found for ${userId} user id.`, 404)
      next(error)
    })
}

const getPlacesByPlacesId = async (req, res, next) => {
  const placeId = req.params.pid
  const error = new HttpError(`No item found for ${placeId} place id.`, 404)
  Place.findById(placeId)
    .exec()
    .then((result) => {
      res.status(200).json({ place: result.toObject({ getters: true }) })
    })
    .catch((err) => {
      next(error)
    })
}

const createPlaces = async (req, res, next) => {
  const errors = validationResult(req)

  if (errors.errors.length > 0) {
    const errorField = errors.errors.map((error) => error.path)
    const errorMessage = new HttpError(
      `Please enter a valid values for ${errorField.toString()}`,
      422
    )
    next(errorMessage)
  }

  const { title, description, location, address, creator } = req.body

  const createdPlace = new Place({
    title,
    description,
    location,
    address,
    creator,
    image:
      'https://images.pexels.com/photos/2224861/pexels-photo-2224861.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  })

  // you can use unshift to add the place at the beginning of the array
  createdPlace
    .save()
    .then((response) => {
      res.status(201).json({ createPlace: response })
    })
    .catch((err) => {
      next(new HttpError(err._message, 404))
    })
}

const patchPlaces = async (req, res, next) => {
  const errors = validationResult(req)

  if (errors.errors.length > 0) {
    const errorField = errors.errors.map((error) => error.path)
    const errorMessage = new HttpError(
      `Please enter a valid values for ${errorField.toString()}`,
      422
    )
    return next(errorMessage)
  }

  const { title, description } = req.body
  const placeId = req.params.pid
  const errorNotFound = new HttpError(
    `No item found for ${placeId} place id.`,
    404
  )
  const error = new HttpError(`Error Occured`, 404)
  let previousPlace
  Place.findById(placeId)
    .then((result) => {
      if (!!result || undefined) {
        return next(errorNotFound)
      }

      previousPlace = result
      previousPlace.title = title
      previousPlace.description = description
      patchThePlace()
    })
    .catch((err) => {
      return next(error)
    })

  const patchThePlace = () => {
    previousPlace
      .save()
      .then((response) => {
        res.status(201).json(response)
      })
      .catch((err) => {
        return next(error)
      })
  }
}

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid
  let foundPlace
  Place.findById(placeId)
    .then((response) => {
      // eslint-disable-next-line no-console
      console.log(response)
      foundPlace = response
      foundPlace
        .deleteOne()
        .then((res) => {
          res.status(201).json({ message: `Delted ${placeId}` })
        })
        .catch((err) => {
          next(new HttpError('error deleting', 404))
        })
    })
    .catch((err) => {
      next(new HttpError('we could not find the place you want to delete', 404))
    })
}

module.exports = {
  getPlacesByUserId,
  getPlacesByPlacesId,
  createPlaces,
  patchPlaces,
  deletePlace,
}
