import React from 'react';
import App from './app';

describe('App', () => {
  afterEach(() => {
    // delete global['fetch'];
  });

  it('should render successfully', async () => {
    // global['fetch'] = jest.fn().mockResolvedValueOnce({
    //   json: () => ({
    //     message: 'my message',
    //   }),
    // });

    expect(App).not.toEqual(undefined);
  });
});
