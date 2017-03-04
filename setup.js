#!/usr/bin/env node

const TestTable = require('./lib/dynogels').TestTable;

TestTable.createTable({
  streamSpecification: {
    streamEnabled: true,
    streamViewType: 'NEW_AND_OLD_IMAGES'
  }
}, (err, data) => {
  if (err) {
    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
  }
});