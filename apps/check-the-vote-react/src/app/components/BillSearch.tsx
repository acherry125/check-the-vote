import React, { useState } from 'react';
import eventUtils from 'viewUtils/eventUtils';
import SubmitButton from 'components/SubmitButton';

export const BillSearch = (props) => {

  const [chamber, setChamber] = useState('');
  const [billNumber, setBillNumber] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.handleSubmit(chamber, billNumber)
  }

  const disabledSubmit: boolean = !(chamber !== '' && billNumber !== '');

  return (
    <form className="bill-search-form form" onSubmit={handleSubmit}>
      <div className="form-input-group--vertical">
        <label htmlFor="bill-chamber">Chamber</label>
        <select id="bill-chamber" value={chamber} onChange={e => setChamber(eventUtils.getTargetValue(e))}>
          <option value=""></option>
          <option value="H.R.">H.R.</option>
          <option value="S.">S.</option>
        </select>
      </div>
      <div className="form-input-group--vertical">
        <label htmlFor="bill-number">Bill Number</label>
        <input type="text" id="bill-number" value={billNumber} onChange={e => setBillNumber(eventUtils.getTargetValue(e))}/>
      </div>
      <SubmitButton disabledSubmit={disabledSubmit} />
    </form>
  );
};

export default BillSearch;
