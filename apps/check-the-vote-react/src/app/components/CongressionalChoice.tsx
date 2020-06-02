import React from 'react';
import BillSearch from 'components/BillSearch';

export const CongressionalChoice = () => {

  const handleSubmit = (chamber: String, billNumber: String) => {
    console.log(chamber, billNumber);
  }

  return (
    <div className="dark-theme page-container--standard">
      <div>
        <h1 className="page-header">Check the vote!</h1>
      </div>
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
  );
};

export default CongressionalChoice;
