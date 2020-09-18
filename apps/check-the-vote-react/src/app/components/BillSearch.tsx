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
      //Deleted previous select element, because it seemed redundant to have those two big buttons there and the select pointing to the same thing.
      //Currently attempting to make the big Congressional Choice buttons act as a filter for search results.
      //Also researching about accessibility Concerns of doing so.
      <label htmlFor="bill-number" style={{opacity: 0}}>Please Enter Bill Number </label>
      <input type="text" id="bill-number" className="form-input" placeHolder="Search Bill Number" value={billNumber} onChange={e => setBillNumber(eventUtils.getTargetValue(e))}/>
      <SubmitButton disabledSubmit={disabledSubmit} />
    </form>
  );
};

export default BillSearch;
