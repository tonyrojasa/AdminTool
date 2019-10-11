'use strict';

var path = require('path'),
    config = require(path.resolve('./config/config'));
var Nexmo = require('nexmo');

/**
 * send sms messages
 */
exports.sendSms = function (to, message) {
    var nexmo = new Nexmo({
        apiKey: config.nexmo.sms.apiKey,
        apiSecret: config.nexmo.sms.apiSecret
    });
    nexmo.message.sendSms(config.nexmo.sms.from, to, message, (error, response) => {
        if (error) {
            throw error;
        } else if (response.messages[0].status != '0') {
            console.error(response);
            throw 'Nexmo returned back a non-zero status';
        } else {
            console.log(response);
        }
    });
};