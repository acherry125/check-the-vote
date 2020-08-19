import React, { useEffect, useState } from 'react';
import { Message } from '@check-the-vote/api-interfaces';

import CongressionalChoice from 'components/CongressionalChoice';
import Navegation from 'components/Navegation';
import CallToAction from 'components/CallToAction';



export const App = () => {
  const [m, setMessage] = useState<Message>({ message: '' });

  useEffect(() => {
    fetch('/api')
      .then((r) => r.json())
      .then(setMessage);
  }, []);

  return (
    <>
      <Navegation />
      <CongressionalChoice />
      <CallToAction />
    </>
  );
};

export default App;
