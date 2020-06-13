import { config, DynamoDB, Endpoint, AWSError } from "aws-sdk";
import ApiUtils from './ApiUtils';
import _ from 'lodash';
import { BILLS_TABLE_DEFINITION } from './DbTableDefinitions';
import { request } from 'http';
import { callbackify } from 'util';

config.update({ region: 'us-east-1' });

var dynamodb = new DynamoDB({
  endpoint: new Endpoint('http://localhost:8000').href
});

const docClient = new DynamoDB.DocumentClient({
  endpoint: new Endpoint('http://localhost:8000').href
});

const createTableIfNotExists = (tableName, createParams): Promise<Object> => {
  const describeParams = {
    TableName: tableName
  };

  // create table if not exists
  return new Promise<Object>((resolve, reject) => {
    dynamodb.describeTable(describeParams, (err, description) => {
      if (err) {
        if (err.code === 'ResourceNotFoundException') {
          dynamodb.createTable(createParams, (err, data) => {
            if (err) {
              console.error(`Unable to create table ${tableName}: \n ${JSON.stringify(err, undefined, 2)}`);
              return reject(err);
            } else {
              console.log(`Created table ${tableName}: \n ${JSON.stringify(data, undefined, 2)}`);
              return resolve(data);
            }
          });
        } else {
          console.error(err);
          return reject(err);
        }
      } else {
        return resolve(description);
      }
    })
  })

}

const toBatches = (items): Array<Array<Object>> => {
  const BATCH_SIZE = 25;
  const batches: Array<Array<Object>> = [];
  _.forEach(items, (b, index) => {
    const batchIndex = _.floor(index / BATCH_SIZE);
    const itemIndex = index % BATCH_SIZE;
    _.set(batches, [batchIndex, itemIndex], b);
  })
  return batches;
}

const getTypeCodeOfVal = (val): string => {
  switch (typeof val) {
    case 'number': 
      return 'N'
    case 'boolean': 
      return 'B'
    default:
      return 'S';
  }
}

type ApiBill = | any;
type DynamoBill = | any;

const convertBillForDb = (bill: ApiBill): DynamoBill => {
  return {
    ...bill,
    billNmbr: bill.number,
    chamber: bill.billType == 'hr' ? 'house' : 'senate',
    session: _.toNumber(_.split(bill.bill_id, '-')[1])
  }
}

const writeBatchParamsToTable = (name: string, batches: Array<Array<Object>>, callBack: (success: boolean, err: AWSError) => any): void => {
  if (_.isEmpty(batches)) {
    callBack(true, null);
    return;
  }

  const batchesToWrite = [...batches];
  const currBatch = batchesToWrite.shift();
  const params = {
    RequestItems: {
      [name]: currBatch,
    }
  };

  docClient.batchWrite(params, function(err, data) {
    if (err) { 
      console.log(err, err.stack); // an error occurred
      callBack(false, err);
    }
    else {
      writeBatchParamsToTable(name, batchesToWrite, callBack);
    }
  });
}

const insertBillData = (session: number, chamber: string, bills: Array<ApiBill>): Promise<Object> => {
  console.log('Inserting data for: ', session, chamber);
  const batchesOfBillsToWrite = toBatches(bills);

  const allBatchParams = _.map(batchesOfBillsToWrite, batch => {
    return _.map(batch, (bill: ApiBill) => {
      const modifiedBill = convertBillForDb(bill);
      const requestParam = {
        PutRequest: {
          Item: modifiedBill
        }
      };
      return requestParam;
    });
  })

  return new Promise((resolve, reject) => {
    const handler = (success: boolean, error: AWSError) => {
      if (success) {
        return resolve();
      } else {
        return reject(error);
      }
    }
  
    return writeBatchParamsToTable(BILLS_TABLE_DEFINITION.TableName, allBatchParams, handler)
  })




}

const populateDBWithBills = (): Promise<void | Object> => {
  const session = 115;
  const chamber = 'house';
  const endpoint: string = ApiUtils.createCongressChamberEndpoint(session, chamber, 'bills','active.json', { offset: 0 });
  return ApiUtils.requestCongressPage(endpoint)
    .then(apiRes => {
      const bills = apiRes[0]['bills'];
      return insertBillData(session, chamber, bills);
    })
    .catch(err => {
      
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
  populateDBWithBills,
  testQuery
}