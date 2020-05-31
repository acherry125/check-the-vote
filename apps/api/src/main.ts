import * as express from 'express';
import { Message } from '@check-the-vote/api-interfaces';
import ApiUtils from './app/ApiUtils.js';

const app = express();

const greeting: Message = { message: 'Welcome to api!' };

app.get('/api', (req, res) => {
  res.send(greeting);
});

app.get('/api/v1/test', (req, res) => {
  ApiUtils.requestCongressPage(ApiUtils.createCongressChamberBaseResourceEndpoint('116', 'senate', 'members.json'))
    .then(apiRes => {
      console.log(apiRes);
      const response: Message = { message: apiRes };
      res.send(response);
    })
    .catch(err => {
      console.error(err);
    })
})

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
server.on('error', console.error);
