import React from 'react';
import RestUtils from 'viewUtils/restUtils';
import BillSearch from 'components/BillSearch';

export const CongressionalChoice = () => {

  const handleSubmit = (chamber: String, billNumber: String) => {
    RestUtils.searchByChamberAndBillNumber(chamber, billNumber)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.error(err);
      })
  }

  return (
    <div>
      <div className="page-container--standard">
        <div className="congress-choice-container">
          <a href="#" className="congress-choice-container__option big-button-link">
            <div>
              Senate
            </div>
          </a>
          <a href="#" className="congress-choice-container__option big-button-link">
            <div>
              House
            </div>
          </a>
          </div>
          <BillSearch
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default CongressionalChoice;
