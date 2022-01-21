const express = require('express');
const { doesValidationErrorExist, PARAM_CONSTANTS, buildQueryValidationChain } = require('../../../shared/validators/validators');
const router = express.Router();
const searchServices = require('./services');

//http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
//https://stackoverflow.com/questions/238260/how-to-calculate-the-bounding-box-for-a-given-lat-lng-location

router.route('/spotlight')
    .get(
        buildQueryValidationChain(
            PARAM_CONSTANTS.LATITUDE,
            PARAM_CONSTANTS.LONGITUDE,
            PARAM_CONSTANTS.DISTANCE,
            PARAM_CONSTANTS.USER_PREVIEW_ID_LIST),
        doesValidationErrorExist,
        (req, res, next) => {
            const lat = req.query.latitude;
            const long = req.query.longitude;
            const distance = req.query.distance;
            const userPreviewIDList = req.query.userPreviewIDList;
            const limits = searchServices.getBounds(distance, { lat, long });
            return searchServices
                .searchByBounds(userPreviewIDList, limits)
                .then(results => {
                    let shuffled = results
                        .map((value) => ({ value, sort: Math.random() }))
                        .sort((a, b) => a.sort - b.sort)
                        .map(({ value }) => value);
                    return res.status(200).json({ users: shuffled.slice(0, 2) });
                })
                .catch(next);
        }
    );

router.route('/people')
    .get(
        buildQueryValidationChain(
            PARAM_CONSTANTS.DISTANCE,
            PARAM_CONSTANTS.PURSUIT,
            PARAM_CONSTANTS.LATITUDE,
            PARAM_CONSTANTS.LONGITUDE
        ),

        doesValidationErrorExist,
        (req, res, next) => {
            const distance = req.query.distance;
            const userPreviewIDList = req.query.userPreviewIDList ? req.query.userPreviewIDList : [];
            const pursuit = req.query.pursuit;
            const lat = req.query.latitude;
            const long = req.query.longitude;
            console.log(pursuit);
            const limits = searchServices.getBounds(distance, { lat, long });
            return searchServices
                .searchByBoundedPursuits(userPreviewIDList, limits, pursuit)
                .then((results => {
                    console.log(results);
                    res.status(200).json({ users: results });
                }))
                .catch(next)
        }
    );

router.route('/posts')
    .get(
        buildQueryValidationChain(
            PARAM_CONSTANTS.DISTANCE,
            PARAM_CONSTANTS.DIFFICULTY,
            PARAM_CONSTANTS.PROGRESSION,
            PARAM_CONSTANTS.USER_PREVIEW_ID_LIST),

        doesValidationErrorExist),
    (req, res, next) => {
        const difficulty = req.query.difficulty;
        const progression = req.query.progression;
        return searchServices
            .searchByBounds(userPreviewIDList, limits)
            .then()
    }

module.exports = router;
