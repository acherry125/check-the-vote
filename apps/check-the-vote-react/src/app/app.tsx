import React, { useEffect, useState } from 'react';
import { Message } from '@check-the-vote/api-interfaces';

import CongressionalChoice from 'components/CongressionalChoice';
export const App = () => {
  
  return (
    <>
      <CongressionalChoice />
    </>
  );
};

export default App;
