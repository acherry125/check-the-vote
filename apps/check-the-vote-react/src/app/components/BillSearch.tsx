import React, { useState } from 'react';
import eventUtils from 'viewUtils/eventUtils';
import SubmitButton from 'components/SubmitButton';
import BillResultCard from 'components/BillResultCard';
import { HOUSE, SENATE } from '@check-the-vote/common/constants';
import { BillResponse } from '@check-the-vote/common/types';
import * as _ from 'lodash';

export const BillSearch = (props) => {

  const [billResults, setBillResults]: [BillResponse[], Function] = useState([]);
  const [chamber, setChamber]: [string, Function] = useState('');
  const [billNumber, setBillNumber]: [string, Function] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    props.handleSubmit(chamber, billNumber)
      .then(response => setBillResults(response))
  }

  const disabledSubmit: boolean = !(chamber !== '' && billNumber !== '');

  return (
    <>
      <form className="bill-search-form form" onSubmit={handleSubmit}>
        <div className="form-input-group--vertical">
          <label htmlFor="bill-chamber">Chamber</label>
          <select id="bill-chamber" value={chamber} onChange={e => setChamber(eventUtils.getTargetValue(e))}>
            <option value=""></option>
            <option value={HOUSE}>H.R.</option>
            <option value={SENATE}>S.</option>
          </select>
        </div>
        <div className="form-input-group--vertical">
          <label htmlFor="bill-number">Bill Number</label>
          <input type="text" id="bill-number" value={billNumber} onChange={e => setBillNumber(eventUtils.getTargetValue(e))} />
        </div>
        <SubmitButton disabledSubmit={disabledSubmit} />
      </form>
      {_.map(billResults, bill => (
        <BillResultCard
          key={bill.billNmbr}
          billData={bill} />
      ))}
    </>
  );
};

export default BillSearch;
