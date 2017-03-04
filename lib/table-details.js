const nodeMachineId = require('node-machine-id');
const machineIdSync = nodeMachineId.machineIdSync;

module.exports.name = `test-${machineIdSync().substring(0, 8)}-dynamodbstream-EHRH`;