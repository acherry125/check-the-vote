import ApiUtils from './ApiUtils';
import DbUtils from './DbUtils';
import { BILLS_TABLE_DEFINITION } from './DbTableDefinitions';

const createBillsTable = () => {
  DbUtils.createTableIfNotExists(BILLS_TABLE_DEFINITION.TableName, BILLS_TABLE_DEFINITION);
}

const syncDb = () => {
  createBillsTable();
}

export default {
  syncDb
}
