#!/usr/bin/env node

const TestTable = require('./lib/dynogels').TestTable;

TestTable.deleteTable((err, data) => {
  if (err) {
    console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
  }
});
