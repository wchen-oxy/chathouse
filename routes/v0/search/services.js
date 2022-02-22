const GeoPoint = require('geopoint');
const UserPreview = require('../../../models/user.preview.model');
const ModelConstants = require('../../../models/constants');
const mongoose = require('mongoose');
const selectModel = require('../../../models/modelServices');
const {
    find,
    findOne,
    findByID,
    findManyByID,
    limitFind,
} = require('../../../data-access/dal');

const getDistance = (lat1, lat2, lon1, lon2) => {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
        + Math.cos(lat1) * Math.cos(lat2)
        * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    //use 6371 for km
    let r = 3956;

    // calculate the result
    return (c * r);
}
 

const getBounds = (distance, crd) => {
    const geopoint = new GeoPoint(parseFloat(crd.lat), parseFloat(crd.long));
    return geopoint.boundingCoordinates(parseInt(distance));
}

const getBoundOperator = (limits) => {
    return ({
        $and: [
            { 'coordinates.latitude': { $gte: limits[0]._degLat } },
            { 'coordinates.longitude': { $gte: limits[0]._degLon } },
            { 'coordinates.latitude': { $lte: limits[1]._degLat } },
            { 'coordinates.longitude': { $lte: limits[1]._degLon } }
        ]
    })
}

//includes a list of ids to prevent duplicates
const searchByBounds = (IDs, limits) => {
    const list = IDs.map(ID => mongoose.Types.ObjectId(ID));
    const _bounds = getBoundOperator(limits);
    return UserPreview.Model.find({
        _id: { $nin: list },
        ..._bounds,

    })
        .lean();
}

const searchByBoundedPursuits = (IDs, limits, pursuits) => {
    const list = IDs.map(ID => mongoose.Types.ObjectId(ID));
    const _bounds = getBoundOperator(limits);
    return UserPreview.Model.find({
        _id: { $nin: list },
        pursuits: {
            $elemMatch: {
                name: { $in: pursuits }
            }
        },
        ..._bounds,
    }).lean();
}

const appendPostData = (users, pursuit) => {
    let mapping = {}
    let postIDs = [];
    for (const user of users) {
        mapping[user.parent_user_id] = [];
        postIDs = postIDs.concat(
            user.pursuits[0].posts
                .slice(0, 3)
                .map(item => item.content_id));
    }
    return findManyByID(
        ModelConstants.POST,
        postIDs,
        false)
        .lean()
        .then(results => {
            for (const result of results) {
                const temp = mapping[result.author_id];
                temp.push(result);
                mapping[result.author_id] = temp;
            }
            for (let i = 0; i < users.length; i++) {
                users[i].pursuits[0].loaded = mapping[users[i].parent_user_id];
            }
            return users;
        })
}

const searchProjects = (pursuitList, IDList, requestQuantity, indexUserID) => {
    return limitFind(ModelConstants.PROJECT, {
        _id: { $nin: IDList },
        index_user_id: { $ne: mongoose.Types.ObjectId(indexUserID) },
        pursuit: { $in: pursuitList }
    }, requestQuantity)
        .then(results => {
            console.log(results);
            return results;
        });
}
exports.getDistance = getDistance;
exports.getBounds = getBounds;
exports.searchByBounds = searchByBounds;
exports.searchByBoundedPursuits = searchByBoundedPursuits;
exports.appendPostData = appendPostData;
exports.searchProjects = searchProjects;
