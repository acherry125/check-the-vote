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

const testQuery = () => {
  var params = {
    ExpressionAttributeValues: {
     ":billName": {
       S: "house freedom act"
      },
      ":cngrNumber": {
        N: '0'
      }
    }, 
    KeyConditionExpression: "billName = :billName and cngrNmbr= :cngrNumber", 
    ProjectionExpression: "billNmbr,cngrNmbr,billName", 
    TableName: "Bills",
    IndexName: 'billName_index',
   };
   dynamodb.query(params, function(err, data) {
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data.Items);           // successful response
   });
}

export default {
  createTableIfNotExists,
  testQuery
}