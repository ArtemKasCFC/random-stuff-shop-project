const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = await Model.findById(req.params.id);
    if (populateOptions) query.populate(populateOptions);
    const doc = query;

    if (!doc) return next(new AppError('No documnet was found with this ID', 404));

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Model.find(req.params.id), req.query).filter().sort().selectFields().paginate();
    const doc = await features.query;

    if (!doc) return next(new AppError('There is no document', 404));

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: doc,
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('No documnet was found with this ID', 404));

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('No documnet was found with this ID', 404));

    res.status(204).json({ status: 'success', data: null });
  });
