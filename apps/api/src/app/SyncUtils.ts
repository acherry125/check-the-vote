import ApiUtils from './ApiUtils';
import DbUtils from './DbUtils';
import { BILLS_TABLE_DEFINITION } from './DbTableDefinitions';
import { 
  MAX_DYNAMODB_BATCH_WRITE_SIZE,
  MAX_API_BILL_PAGE_SIZE
} from './constants';
import _ from 'lodash';
import * as math from 'mathjs';
import { ApiBill } from './types';
import { AWSError } from 'aws-sdk';

const MIN_COMMON_WRITE_API_SIZE = math.lcm(MAX_API_BILL_PAGE_SIZE, MAX_DYNAMODB_BATCH_WRITE_SIZE);

const syncDb = (): Promise<boolean | AWSError> => {
  console.log('syncing');
  const session = 115;
  const chamber = 'house';
  return populateDBWithBills(session, chamber);
}

const makeGetBillEndpoint = (session:115, chamber:string, offset: number): string => ApiUtils.createCongressChamberEndpoint(session, chamber, 'bills','active.json', { offset: offset });

const populateDBWithBills = (session, chamber) => {

  let iter = 0;
  const billsForChamberSession = [];

  return populateDBWithSetOfBills(session, chamber, iter * MIN_COMMON_WRITE_API_SIZE, billsForChamberSession)
    .then(retrievedBills => {
      const session = 115;
      const chamber = 'house';
      return DbUtils.insertBillData(session, chamber, retrievedBills);
    })
}

const populateDBWithSetOfBills = (session, chamber, offset, billsAccumulator): Promise<Array<ApiBill>> => {
  console.log('Populating ', session, chamber, offset);
  if (offset >= MIN_COMMON_WRITE_API_SIZE) {
    return billsAccumulator;
  }


  const endpoint: string = makeGetBillEndpoint(session, chamber, offset);
  console.log('endpoint', endpoint);
  return ApiUtils.requestCongressPage(endpoint)
    .then(apiRes => {
      console.log('Got response for offset', offset);
      const bills = apiRes[0]['bills'];
      _.forEach(bills, b => billsAccumulator.push(b));
      return populateDBWithSetOfBills(session, chamber, offset + MAX_API_BILL_PAGE_SIZE, billsAccumulator);
    })
    .catch(err => {
      console.error(err);
      return err;
    })


}

export default {
  syncDb
}
