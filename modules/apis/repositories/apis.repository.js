/**
 * Module dependencies
 */
const mongoose = require('mongoose');

const Api = mongoose.model('Api');

/**
 * @desc Function to get all api in db
 * @return {Array} All apis
 */
exports.list = () => Api.find().sort('-createdAt').exec();

/**
 * @desc Function to create a api in db
 * @param {Object} api
 * @return {Object} api
 */
exports.create = (api) => new Api(api).save();

/**
 * @desc Function to get a api from db
 * @param {String} id
 * @return {Object} api
 */
exports.get = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Api.findOne({ _id: id }).populate('history').exec();
};

/**
 * @desc Function to update a api in db
 * @param {Object} api
 * @return {Object} api
 */
exports.update = (api) => new Api(api).save().then((a) => a.populate('history').execPopulate());

/**
 * @desc Function to delete a api in db
 * @param {Object} api
 * @return {Object} confirmation of delete
 */
exports.delete = (api) => Api.deleteOne({ _id: api.id }).exec();

/**
 * @desc Function to import list of locations in db
 * @param {Object} locations
 * @return {Object} locations
 */
exports.import = (collection, items) => {
  const _schema = new mongoose.Schema({}, {
    collection,
    strict: false,
  });

  let model;
  try {
    model = mongoose.model(collection);
  } catch (error) {
    model = mongoose.model(collection, _schema);
  }

  return model.bulkWrite(items.map((item) => ({
    updateOne: {
      filter: item.filter,
      update: item.update,
      arrayFilters: item.arrayFilters ? item.arrayFilters : [],
      upsert: item.upsert ? item.upsert : false,
    },
  })));
};


/**
 * @desc Function to get api data from db
 * @param {string} colletion name
 * @return [{Object}] data
 */
exports.listApi = (collection) => {
  const _schema = new mongoose.Schema({}, {
    collection,
    strict: false,
    timestamps: true,
  });

  let model;
  try {
    model = mongoose.model(collection);
  } catch (error) {
    model = mongoose.model(collection, _schema);
  }

  return model.find().sort('-updatedAt').exec();
};


/**
 * @desc Function to ask for  api data in db
 * @param {Object} locations
 * @return {Object} locations
 */
exports.getApi = (collection, filters) => {
  const _schema = new mongoose.Schema({}, {
    collection,
    strict: false,
    timestamps: true,
  });

  let model;
  try {
    model = mongoose.model(collection);
  } catch (error) {
    model = mongoose.model(collection, _schema);
  }

  return model.findOne(filters).exec();
};

/**
 * @desc Function to ask for  api data in db
 * @param {Object} locations
 * @return {Object} locations
 */
exports.getAggregateApi = (collection) => {
  const _schema = new mongoose.Schema({}, {
    collection,
    strict: false,
    timestamps: true,
  });

  let model;
  try {
    model = mongoose.model(collection);
  } catch (error) {
    model = mongoose.model(collection, _schema);
  }

  return model.aggregate([
    {
      $match: { '@date': '2020-03-26T00:00:00+01:00' },
    },
    {
      $unwind: { path: '$weathers' },
    },
    {
      $project: {
        status: { $arrayElemAt: ['$weathers.status.value', 0] },
        temp: { $arrayElemAt: ['$weathers.temp.value', 0] },
      },
    },
    {
      $group: {
        _id: '$_id',
        status: { $avg: '$status' },
        temp: { $avg: '$temp' },
      },
    },
  ]).sort('-updatedAt').exec();
};


// db.meteoFrance.aggregate([
//   {
//     $match: { '@date': '2020-03-26T00:00:00+01:00' },
//   },
//   {
//     $unwind: { path: '$weathers' },
//   },
//   {
//     $project: {
//       status: { $arrayElemAt: ['$weathers.status.value', 0] },
//       temp: { $arrayElemAt: ['$weathers.temp.value', 0] },
//     },
//   },
//   {
//     $group: {
//       _id: '$_id',
//       status: { $avg: '$status' },
//       temp: { $avg: '$temp' },
//     },
//   },
// ]);


// db.mareeInfo.aggregate([
//   {
//     $match: { '@date': '2020-04-04T00:00:00+02:00' },
//   },
//   {
//     $unwind: { path: '$coeffs' },
//   },
//   {
//     $project: {
//       coeff: { $arrayElemAt: ['$coeffs.coeff.value', 0] },
//       height: { $arrayElemAt: ['$coeffs.height.value', 0] },
//       hour: { $arrayElemAt: ['$coeffs.hour.value', 0] },
//     },
//   },
//   {
//     $match: { coeff: { $gt: 60 } },
//   },
// ]);
