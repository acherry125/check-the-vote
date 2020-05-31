import React, { useEffect, useState } from 'react';
import { Message } from '@check-the-vote/api-interfaces';

import CongressionalChoice from 'components/CongressionalChoice';
export const App = () => {
  const [m, setMessage] = useState<Message>({ message: '' });

  useEffect(() => {
    fetch('/api')
      .then((r) => r.json())
      .then(setMessage);
  }, []);

  return (
    <>
      <CongressionalChoice />
    </>
  );
};

export default App;
