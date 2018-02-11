'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Receipt = mongoose.model('Receipt'),
  EventRegistration = mongoose.model('Eventregistration'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Receipt
 */
exports.create = function(req, res) {
  var receipt = new Receipt(req.body);
  receipt.user = req.user;
  updateEventRegistrationBalanceAmount(req.body.oldEventregistration, function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      updateEventRegistrationBalanceAmount(req.body.eventregistration, function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          receipt.eventRegistration = req.body.eventregistration ? req.body.eventregistration : receipt.eventRegistration;
          receipt.save(function(err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(receipt);
            }
          });
        }    
      });
    }    
  });
};

var updateEventRegistrationBalanceAmount = function(eventRegistration, callback) {
  if (eventRegistration) {
    EventRegistration.findById(eventRegistration._id).exec(function(err, eventregistration) {
      if (err) {
        return callback(err);
      } else {
        eventregistration.balanceAmount = eventRegistration.balanceAmount;
        eventregistration.save(function(err) {
          eventregistration = EventRegistration(eventregistration);
          if (err) {
            return callback(err);
          } else {
            callback();
          }
        });
      }
    });
  } else {    
    callback();
  }    
};

/**
 * Show the current Receipt
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var receipt = req.receipt ? req.receipt.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  receipt.isCurrentUserOwner = req.user && receipt.user && receipt.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(receipt);
};

/**
 * Update a Receipt
 */
exports.update = function(req, res) {
  var receipt = req.receipt;
  receipt = _.extend(receipt, req.body);
  updateEventRegistrationBalanceAmount(req.body.oldEventregistration, function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      updateEventRegistrationBalanceAmount(req.body.eventregistration, function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          receipt.eventRegistration = req.body.eventregistration ? req.body.eventregistration : receipt.eventRegistration;
          receipt.save(function(err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              res.jsonp(receipt);
            }
          });
        }    
      });
    }    
  });
};

/**
 * Delete an Receipt
 */
exports.delete = function(req, res) {
  var receipt = req.receipt;

  updateEventRegistrationBalanceAmount(req.body.eventregistration, function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      receipt.remove(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(receipt);
        }
      });
    }    
  });
};

/**
 * List of Receipts
 */
exports.list = function(req, res) {
  var query = _.forEach(req.query, function(value, key) {
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

  Receipt.find(query).sort('-created')
    .populate('event')
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'event'
      }
    })
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'eventPeopleGroup'
      }
    })
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'personType'
      }
    })
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'person',
        populate: {
          path: 'personType',
          model: 'Persontype'
        }
      }
    })
    .populate('user', 'displayName').exec(function(err, receipts) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(receipts);
      }
    });
};

/**
 * List of Current Receipts (related event is not ended)
 */
exports.listAllCurrent = function(req, res) {
  var query = _.forEach(req.query, function(value, key) {
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

  Receipt.find(query).sort('-created')
    .populate('event')
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'event'
      }
    })
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'eventPeopleGroup'
      }
    })
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'personType'
      }
    })
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'person',
        populate: {
          path: 'personType',
          model: 'Persontype'
        }
      }
    })
    .populate('user', 'displayName').exec(function(err, receipts) {
      receipts = receipts.filter(function(receipt) {
        return ((receipt.event && (!receipt.event.ended || receipt.event.openEnrollment)) ||
          (receipt.eventRegistration && receipt.eventRegistration.event &&
            (!receipt.eventRegistration.event.ended || receipt.eventRegistration.event.openEnrollment)));
      });
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(receipts);
      }
    });
};

/**
 * List of Receipts by EventRegistrationId
 */
exports.listByEventRegistrationId = function(req, res) {
  var eventRegistrationId = req.params.eventRegistrationId;
  Receipt.where('eventRegistration', eventRegistrationId).sort('-created')
    .populate('event')
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'event'
      }
    })
    .populate('user', 'displayName').exec(function(err, receipts) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(receipts);
      }
    });
};


/**
 * List of Receipts by eventId
 */
exports.listByEventId = function(req, res) {
  var eventId = req.params.eventId;
  Receipt.where('event', eventId).sort('-created')
    .populate('event')
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'event'
      }
    })
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'eventPeopleGroup'
      }
    })
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'personType'
      }
    })
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'person',
        populate: {
          path: 'personType',
          model: 'Persontype'
        }
      }
    })
    .populate('user', 'displayName').exec(function(err, receipts) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(receipts);
      }
    });
};

/**
 * Receipt middleware
 */
exports.receiptByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Receipt is invalid'
    });
  }

  Receipt.findById(id).populate('user', 'displayName')
    .populate('event')
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'person'
      }
    })
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'event'
      }
    })
    .populate({
      path: 'eventRegistration',
      populate: {
        path: 'personType'
      }
    })
    .exec(function(err, receipt) {
      if (err) {
        return next(err);
      } else if (!receipt) {
        return res.status(404).send({
          message: 'No Receipt with that identifier has been found'
        });
      }
      req.receipt = receipt;
      next();
    });
};