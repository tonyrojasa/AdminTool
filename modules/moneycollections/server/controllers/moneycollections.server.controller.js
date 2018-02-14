'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Moneycollection = mongoose.model('Moneycollection'),
  Event = mongoose.model('Event'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


var setTotalPerType = function (flow) {
  flow.reportTotals = {};
  flow.reportTotals.totalDiezmos = 0;
  flow.reportTotals.totalOfrendas = 0;
  flow.reportTotals.totalGruposVida = 0;
  flow.reportTotals.totalDicipulados = 0;
  flow.reportTotals.totalSodas = 0;
  flow.reportTotals.totalOtros = 0;
  switch (flow.type) {
    case 'Diezmo':
      flow.reportTotals.totalDiezmos = flow.isExpense ? flow.reportTotals.totalDiezmos - flow.total : flow.reportTotals.totalDiezmos + flow.total;
      break;
    case 'Ofrenda':
      flow.reportTotals.totalOfrendas = flow.isExpense ? flow.reportTotals.totalOfrendas - flow.total : flow.reportTotals.totalOfrendas + flow.total;
      break;
    case 'Grupo vida':
      flow.reportTotals.totalGruposVida = flow.isExpense ? flow.reportTotals.totalGruposVida - flow.total : flow.reportTotals.totalGruposVida + flow.total;
      break;
    case 'Dicipulado':
      flow.reportTotals.totalDicipulados = flow.isExpense ? flow.reportTotals.totalDicipulados - flow.total : flow.reportTotals.totalDicipulados + flow.total;
      break;
    case 'Soda':
      flow.reportTotals.totalSodas = flow.isExpense ? flow.reportTotals.totalSodas - flow.total : flow.reportTotals.totalSodas + flow.total;
      break;
    case 'Otro':
      flow.reportTotals.totalOtros = flow.isExpense ? flow.reportTotals.totalOtros - flow.total : flow.reportTotals.totalOtros + flow.total;
      break;
  }
  return flow;
};

/**
 * Create a Moneycollection
 */
exports.create = function (req, res) {
  var moneycollection = new Moneycollection(req.body);
  moneycollection.user = req.user;

  moneycollection.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(moneycollection);
    }
  });
};

/**
 * Show the current Moneycollection
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var moneycollection = req.moneycollection ? req.moneycollection.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  moneycollection.isCurrentUserOwner = req.user && moneycollection.user && moneycollection.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(moneycollection);
};

/**
 * Update a Moneycollection
 */
exports.update = function (req, res) {
  var moneycollection = req.moneycollection;

  moneycollection = _.extend(moneycollection, req.body);

  moneycollection.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(moneycollection);
    }
  });
};

/**
 * Delete an Moneycollection
 */
exports.delete = function (req, res) {
  var moneycollection = req.moneycollection;
  var idUser = req.user;

  moneycollection.delete(idUser, function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(moneycollection);
    }
  });
};

/**
 * List of Moneycollections
 */
exports.list = function (req, res) {
  debugger;
  var query = _.forEach(req.query, function (value, key) {
    var queryParam = {
      $regex: new RegExp('^' + value + '$', 'i'),
      $options: 'i'
    };
    req.query[key] = _.zipObject([key], [queryParam]);
  });

  if (!_.isEmpty(query)) {
    query = {
      $and: _.toArray(query)
    };
  }

  Moneycollection.find(query).sort('-created')
    .populate('user', 'displayName')
    .populate('organization').exec(function (err, moneycollections) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        debugger;
        _.each(moneycollections, function (moneycollection, key) {
          for (var i = 0; i <= moneycollection.moneyFlows.length - 1; i++) {
            moneycollection.moneyFlows[i] = setTotalPerType(moneycollection.moneyFlows[i]);
          }
          moneycollections[key] = moneycollection;
          if (key === moneycollections.length - 1) {
            res.jsonp(moneycollections);
          }
        });
      }
    });
};

/**
 * List of current Moneycollections
 */
exports.listAllCurrent = function (req, res) {
  debugger;
  var query = _.forEach(req.query, function (value, key) {
    var queryParam = {
      $regex: new RegExp('^' + value + '$', 'i'),
      $options: 'i'
    };
    req.query[key] = _.zipObject([key], [queryParam]);
  });

  if (!_.isEmpty(query)) {
    query = {
      $and: _.toArray(query)
    };
  }

  Moneycollection.find(query).sort('-created')
    .populate('user', 'displayName')
    .populate('organization')
    .exec(function (err, moneycollections) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        debugger;
        _.each(moneycollections, function (moneycollection, key) {
          for (var i = 0; i <= moneycollection.moneyFlows.length - 1; i++) {
            moneycollection.moneyFlows[i] = setTotalPerType(moneycollection.moneyFlows[i]);
          }
          moneycollections[key] = moneycollection;
          if (key === moneycollections.length - 1) {
            res.jsonp(moneycollections);
          }
        });
      }
    });
};

/**
 * Moneycollection middleware
 */
exports.moneycollectionByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Moneycollection is invalid'
    });
  }

  Moneycollection.findById(id)
    .populate('user', 'displayName')
    .populate('organization')
    .exec(function (err, moneycollection) {
      if (err) {
        return next(err);
      } else if (!moneycollection) {
        return res.status(404).send({
          message: 'No Moneycollection with that identifier has been found'
        });
      }
      req.moneycollection = moneycollection;
      next();
    });
};