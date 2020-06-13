import ApiUtils from './ApiUtils';
import DbUtils from './DbUtils';
import { BILLS_TABLE_DEFINITION } from './DbTableDefinitions';

const createBillsTable = (): Promise<Object> => {
  return DbUtils.createTableIfNotExists(BILLS_TABLE_DEFINITION.TableName, BILLS_TABLE_DEFINITION);
}

const syncDb = (): Promise<void | Object> => {
  console.log('syncing');
  return createBillsTable()
    .then(res => {
      return DbUtils.populateDBWithBills();
    })
    .catch(err => {
      console.error();
    })
}

export default {
  syncDb
}
