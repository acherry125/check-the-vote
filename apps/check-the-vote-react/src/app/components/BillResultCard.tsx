import React, { useState } from 'react';
import * as _ from 'lodash';
import converter from 'number-to-words';

export const BillResultCard = (props) => {
  const { billData } = props;
  const { short_title, session, title, billNmbr, chamber, summary, govtrack_url } = billData;
  return (
    <div className="bill-result-card"> 
      <h3 className={'title--' + chamber}>{converter.toOrdinal(session)} {_.upperFirst(chamber)}  {billNmbr}: {short_title}</h3>
      <h4 className={'title--' + chamber}>{title}</h4>
      <p className={'text--' + chamber}>{summary}</p>
      <a target="_blank" href={govtrack_url}>See the full history of this bill here</a>
    </div>
  );
};

export default BillResultCard;
