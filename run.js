#!/usr/bin/env node

const DynamoDBStream = require('dynamodb-stream');
const debug = require('debug')(`test-run:${process.pid}`);
const AWS = require('aws-sdk');
const BBPromise = require('bluebird');
const DynamoDBValue = require('dynamodb-value');
const chance = require('chance')();
const TestTable = require('./lib/dynogels').TestTable;
const awsConfig = require('./lib/aws').config;

AWS.config.update(awsConfig);

const getLatestStreamArn = (table) => new Promise((resolve, reject) => {
  table.describeTable((err, data) => {
    if (err) {
      return reject(err);
    }
    return resolve(data.Table.LatestStreamArn);
  });
});

const toDynamoDbStream = streamArn => new DynamoDBStream(new AWS.DynamoDBStreams(), streamArn);

const createRandomItem = (table, nTimes = 1) =>
  Promise.all(
    [...new Array(nTimes).keys()].map(async () => {
      const key = chance.word();
      debug('creating: ', key);
      const result = await BBPromise.promisify(table.create)({key, value: chance.word()})
      debug('created : ', key);
      return result;
    })
  ).then(items => {
    debug(`${items.length} items created: `, items.map(item => item.get('key')).reduce((k1, k2) => `${k1}, ${k2}`));
    return items;
  });

const processFromStream = table => dynamoDbStream => new Promise((resolve, reject) => {
  dynamoDbStream.fetchStreamShards(err => {
    if (err) {
      return reject(err);
    }
    const expectedSize = 10;
    let collectedItems = [];

    const fetchRecords = () => dynamoDbStream.fetchStreamRecords((err, data) => {
      if (err) {
        return reject(err);
      }
      debug('before: collectedItems length = ', collectedItems.length);
      const newItems = data.map(record => DynamoDBValue.toJavascript(record.dynamodb.NewImage));

      newItems.forEach(item => collectedItems.push(item));
      debug('after: collectedItems length = ', collectedItems.length);
      if (collectedItems.length === expectedSize) {
        return resolve(collectedItems);
      }
      return fetchRecords();
    });
    fetchRecords();
    createRandomItem(TestTable, expectedSize);
  });



});

debug('started - don\'t fret');

getLatestStreamArn(TestTable)
  .then(toDynamoDbStream)
  .then(processFromStream(TestTable))
  .then(console.log);