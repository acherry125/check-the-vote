const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

var dynamodb = new AWS.DynamoDB({
  endpoint: new AWS.Endpoint('http://localhost:8000')
});


const createTableIfNotExists = (tableName, createParams) => {
  const describeParams = {
    TableName: tableName
  };

  // create table if not exists
  dynamodb.describeTable(describeParams, (err, data) => {
    if (err) {
      if (err.code === 'ResourceNotFoundException') {
        dynamodb.createTable(createParams, (err, data) => {
          if (err) {
            console.error(`Unable to create table ${tableName}: \n ${JSON.stringify(err, undefined, 2)}`);
          } else {
            console.log(`Created table ${tableName}: \n ${JSON.stringify(data, undefined, 2)}`);
          }
        });
      } else {
        console.error(err);
      }
    }
  })
}


export default {
  createTableIfNotExists
}