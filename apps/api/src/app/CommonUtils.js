import { BILL_TYPES_FOR_CHAMBER } from '@check-the-vote/common/constants';

const getChamberForNumber = (billNumber) => {
  const numberParts = _.split(billNumber, '.');
  const joinedNumberTypeParts = _.join(numberTypeParts, _.dropRight(numberParts, 1), '.');
  return _.findKey(BILL_TYPES_FOR_CHAMBER, type => joinedNumberTypeParts == type);
}

export default {
  getChamberForNumber
}