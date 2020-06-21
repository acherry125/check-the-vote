export const SENATE: string = 'senate';
export const HOUSE: string = 'house';

export const MAX_API_BILL_PAGE_SIZE = 20;
export const MAX_DYNAMODB_BATCH_WRITE_SIZE = 25;

export const BILL_TYPES_FOR_CHAMBER = {
  [HOUSE]: ['H.R.','H.J.','H.J.RES.','H.CON.RES'],
  [SENATE]: ['S.','S.J.','S.J.RES.','S.CON.RES']
}