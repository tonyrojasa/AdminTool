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


var setTotalPerType = function (moneycollection, flow) {
  if (!moneycollection.summary) {
    moneycollection.summary = {};
    moneycollection.summary.totalDiezmos = 0;
    moneycollection.summary.totalDiezmosEgresos = 0;
    moneycollection.summary.totalOfrendas = 0;
    moneycollection.summary.totalOfrendasEgresos = 0;
    moneycollection.summary.totalGruposVida = 0;
    moneycollection.summary.totalGruposVidaEgresos = 0;
    moneycollection.summary.totalDicipulados = 0;
    moneycollection.summary.totalDicipuladosEgresos = 0;
    moneycollection.summary.totalSodas = 0;
    moneycollection.summary.totalSodasEgresos = 0;
    moneycollection.summary.totalOtros = 0;
    moneycollection.summary.totalOtrosEgresos = 0;
    moneycollection.summary.totalEgresos = 0;
  }
  switch (flow.type) {
    case 'Diezmo':
      if (flow.isExpense) {
        moneycollection.summary.totalDiezmosEgresos = moneycollection.summary.totalDiezmosEgresos + flow.total;
      } else {
        moneycollection.summary.totalDiezmos = moneycollection.summary.totalDiezmos + flow.total;
     
      }
      break;
    case 'Ofrenda':
      if (flow.isExpense) {
        moneycollection.summary.totalOfrendasEgresos = moneycollection.summary.totalOfrendasEgresos + flow.total;        
      } else {
        moneycollection.summary.totalOfrendas = moneycollection.summary.totalOfrendas + flow.total;
      }
      break;
    case 'Grupo vida':
      if (flow.isExpense) {
        moneycollection.summary.totalGruposVidaEgresos = moneycollection.summary.totalGruposVidaEgresos + flow.total;      
      } else {
        moneycollection.summary.totalGruposVida = moneycollection.summary.totalGruposVida + flow.total;      
      }
      break;
    case 'Dicipulado':
      if (flow.isExpense) {
        moneycollection.summary.totalDicipuladosEgresos = moneycollection.summary.totalDicipuladosEgresos + flow.total;          
      } else {
        moneycollection.summary.totalDicipulados = moneycollection.summary.totalDicipulados + flow.total;          
      }
      break;
    case 'Soda':
      if (flow.isExpense) {
        moneycollection.summary.totalSodasEgresos = moneycollection.summary.totalSodasEgresos + flow.total;
         
      } else {
        moneycollection.summary.totalSodas = moneycollection.summary.totalSodas + flow.total;         
      }
      break;
    case 'Otro':
      if (flow.isExpense) {
        moneycollection.summary.totalOtrosEgresos = moneycollection.summary.totalOtrosEgresos + flow.total;         
      } else {
        moneycollection.summary.totalOtros = moneycollection.summary.totalOtros + flow.total;         
      }
      break;
  }
  if (flow.isExpense) {
    moneycollection.summary.totalEgresos = moneycollection.summary.totalEgresos + flow.total;
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
        _.each(moneycollections, function (moneycollection, key) {
          if (moneycollection.moneyFlows.length > 0) {                         
            moneycollection = setTotalPerType(moneycollection);
          }
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
        _.each(moneycollections, function (moneycollection, key) {
          
          _.each(moneycollection.moneyFlows, function(flow) {              
            setTotalPerType(moneycollection, flow);
          });

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