const AWS = require('aws-sdk');

module.exports.config = {
  region: 'us-west-2',
  credentials: new AWS.SharedIniFileCredentials({profile: 'labs'})
};
