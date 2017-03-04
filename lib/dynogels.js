const awsConfig = require('./aws').config;
const Joi = require('joi');
const dynogels = require('dynogels');
const nodeMachineId = require('node-machine-id');

const machineIdSync = nodeMachineId.machineIdSync;

dynogels.AWS.config.update(awsConfig);

const TestTable = dynogels.define('TestTable', {
  tableName: `test-${machineIdSync().substring(0, 8)}-dynamodbstream-EHRH`,
  hashKey : 'key',

  timestamps : true,

  schema : {
    key : Joi.string(),
    value : Joi.string()
  }
});

exports.TestTable = TestTable;

// module.exports = function() {
//   return dynogels;
// };