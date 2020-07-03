import ApiUtils from './ApiUtils';
import DbUtils from './DbUtils';
import * as _ from 'lodash';
import * as math from 'mathjs';
import { 
  MAX_DYNAMODB_BATCH_WRITE_SIZE,
  MAX_API_BILL_PAGE_SIZE
} from '@check-the-vote/common/constants';
import { ApiBill } from '@check-the-vote/common/types';
import { AWSError } from 'aws-sdk';

const MIN_COMMON_WRITE_API_SIZE = math.lcm(MAX_API_BILL_PAGE_SIZE, MAX_DYNAMODB_BATCH_WRITE_SIZE);

const syncDb = (mostRecentSession, earliestSession): Promise<boolean | AWSError> => {
  const chamber = 'both';
  if (mostRecentSession < earliestSession) {
    console.log(`Finished synchronizing data at ${new Date().toString()} !`)
    return Promise.resolve(true);
  }

  console.log('Populating chamber and session', chamber, mostRecentSession);

  return populateDBWithBills(mostRecentSession, chamber)
    .then(res => {
      return syncDb(mostRecentSession - 1, earliestSession)
    })

}

const makeGetBillEndpoint = (session:115, chamber:string, offset: number): string => ApiUtils.createCongressChamberEndpoint(session, chamber, 'bills','introduced.json', { offset: offset });

const populateDBWithBills = (session, chamber) => {

  const populateHelper = (offset: number): Promise<boolean | AWSError> => {
    const billsForChamberSession = [];
    console.log('Syncing db, batch number', offset);

    console.log(`Populating ${chamber} chamber session ${session} batch ${offset} for at offset ${offset * MIN_COMMON_WRITE_API_SIZE}`);

    return populateDBWithSetOfBills(session, chamber, offset * MIN_COMMON_WRITE_API_SIZE, 0, billsForChamberSession)
    .then(retrievedBills => {
      return DbUtils.insertBillData(retrievedBills);
    })
    .then(bills => {
      if (_.size(bills) % MIN_COMMON_WRITE_API_SIZE > 0) {
        return true;
      }
      return populateHelper(offset + 1);
    })
    .catch((err:AWSError) => {
      return err;
    })
  }

  return populateHelper(0);
}

const populateDBWithSetOfBills = (session, chamber, startingRecord, offset, billsAccumulator): Promise<Array<ApiBill>> => {
  const totalOffset = startingRecord + offset;
  
  if (totalOffset >= startingRecord + MIN_COMMON_WRITE_API_SIZE) {
    return billsAccumulator;
  }


  const endpoint: string = makeGetBillEndpoint(session, chamber, totalOffset);

  return ApiUtils.requestCongressPage(endpoint)
    .then(apiRes => {
      const bills = apiRes[0]['bills'];
      _.forEach(bills, b => billsAccumulator.push(b));
      return populateDBWithSetOfBills(session, chamber, startingRecord, offset + MAX_API_BILL_PAGE_SIZE, billsAccumulator);
    })
    .catch(err => {
      console.error(err);
      return err;
    })


}

export default {
  syncDb
}
