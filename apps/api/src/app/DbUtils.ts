import { config, DynamoDB, Endpoint, AWSError } from 'aws-sdk';
import CommonUtils from './CommonUtils';
import * as _ from 'lodash';
import { BILLS_TABLE_DEFINITION } from './DbTableDefinitions';
import { ApiBill, DynamoBill } from '@check-the-vote/common/types';
import { BILL_TYPES_FOR_CHAMBER } from '@check-the-vote/common/constants';

config.update({ region: 'us-east-1' });

var dynamodb = new DynamoDB({
  endpoint: new Endpoint('http://localhost:8000').href,
});

const docClient = new DynamoDB.DocumentClient({
  endpoint: new Endpoint('http://localhost:8000').href,
});

const createTableIfNotExists = (tableName, createParams): Promise<Object> => {
  console.log(`Attempting to create table: ${tableName}`);
  const describeParams = {
    TableName: tableName,
  };

  // create table if not exists
  return new Promise<Object>((resolve, reject) => {
    dynamodb.describeTable(describeParams, (err, description) => {
      if (err) {
        if (err.code === 'ResourceNotFoundException') {
          dynamodb.createTable(createParams, (err, data) => {
            if (err) {
              console.error(
                `Unable to create table ${tableName}: \n ${JSON.stringify(
                  err,
                  undefined,
                  2
                )}`
              );
              return reject(err);
            } else {
              console.log(
                `Created table ${tableName}: \n ${JSON.stringify(
                  data,
                  undefined,
                  2
                )}`
              );
              return resolve(data);
            }
          });
        } else {
          console.error(err);
          return reject(err);
        }
      } else {
        console.log(`Table ${tableName} already exists.`);
        return resolve(description);
      }
    });
  });
};

const createBillsTable = (): Promise<Object> => {
  return createTableIfNotExists(
    BILLS_TABLE_DEFINITION.TableName,
    BILLS_TABLE_DEFINITION
  );
};

const toBatches = (items): Array<Array<Object>> => {
  const BATCH_SIZE = 25;
  const batches: Array<Array<Object>> = [];
  _.forEach(items, (b, index: number) => {
    const batchIndex = _.floor(index / BATCH_SIZE);
    const itemIndex = index % BATCH_SIZE;
    _.set(batches, [batchIndex, itemIndex], b);
  });
  return batches;
};

const getTypeCodeOfVal = (val): string => {
  switch (typeof val) {
    case 'number':
      return 'N';
    case 'boolean':
      return 'B';
    default:
      return 'S';
  }
};

const convertBillForDb = (bill: ApiBill): DynamoBill => {
  return {
    ...bill,
    billNmbr: bill.number,
    chamber: CommonUtils.getChamberForNumber(bill.number),
    session: _.toNumber(_.split(bill.bill_id, '-')[1]),
  };
};

const writeBatchParamsToTable = (
  name: string,
  batches: Array<Array<Object>>,
  callBack: (success: boolean, err: AWSError) => any
): void => {
  if (_.isEmpty(batches)) {
    callBack(true, null);
    return;
  }

  const currBatch = batches[0];
  const params = {
    RequestItems: {
      [name]: currBatch,
    },
  };

  docClient.batchWrite(params, function (err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      callBack(false, err);
    } else {
      writeBatchParamsToTable(name, _.slice(batches, 1), callBack);
    }
  });
};

const insertBillData = (
  bills: Array<ApiBill>
): Promise<Object[] | AWSError> => {
  console.log('Inserting data for: ');
  const batchesOfBillsToWrite = toBatches(bills);

  const allBatchParams = _.map(batchesOfBillsToWrite, (batch) => {
    return _.map(batch, (bill: ApiBill) => {
      const modifiedBill = convertBillForDb(bill);
      const requestParam = {
        PutRequest: {
          Item: modifiedBill,
        },
      };
      return requestParam;
    });
  });

  return new Promise((resolve, reject) => {
    const handler = (success: boolean, error: AWSError) => {
      if (success) {
        return resolve(bills);
      } else {
        return reject(error);
      }
    };

    return writeBatchParamsToTable(
      BILLS_TABLE_DEFINITION.TableName,
      allBatchParams,
      handler
    );
  });
};

const getBillsByChamberAndBillNumber = (
  chamber: string,
  billNumber: string
): Promise<Object> => {
  const billNumberStripped = _.last(_.split(billNumber, '.'));
  const typesForBill = BILL_TYPES_FOR_CHAMBER[chamber];
  const queryPromises = _.map(typesForBill, type => {
    const params = {
      ExpressionAttributeValues: {
        ':billNmbr': type + billNumberStripped,
        ':chamber': chamber,
      },
      ExpressionAttributeNames: {
        "#billNmbr": "billNmbr",
        "#chamber": "chamber"
      },
      KeyConditionExpression: '#billNmbr = :billNmbr and #chamber = :chamber',
      TableName: 'Bills',
    };
    console.log(params);
    return new Promise((resolve, reject) => {
      docClient.query(params, function (err, data) {
        if (err) reject(err);
        // an error occurred
        else resolve(data.Items); // successful response
      });
    });
  })
  
  return Promise.all(queryPromises);
};

export default {
  createTableIfNotExists,
  createBillsTable,
  insertBillData,
  getBillsByChamberAndBillNumber,
};
