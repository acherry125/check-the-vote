import React, { useState } from 'react';

export const SubmitButton = (props) => {

  return (
  <input className="button button--inline-submit primary" type="submit" value="GO" disabled={props.disabledSubmit}/>
  );
};

export default SubmitButton;
