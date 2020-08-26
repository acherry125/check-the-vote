import { BILL_TYPES_FOR_CHAMBER } from '@check-the-vote/common/constants';
import * as _ from 'lodash';

const getChamberForNumber = (billNumber) => {
  const joinedNumberTypeParts: string = _.join(_.dropRight(_.split(billNumber, '.'), 1)); // get the chamber signifier at the beginning of the number
  return _.findKey(BILL_TYPES_FOR_CHAMBER, type => _.includes(type, joinedNumberTypeParts));
}

export default {
  getChamberForNumber
}