import * as express from 'express';
import { Message } from '@check-the-vote/api-interfaces';
import SyncUtils from './app/SyncUtils';

var schedule = require('node-schedule');

const app = express();

const greeting: Message = { message: 'Welcome to api!' };

app.get('/api', (req, res) => {
  res.send(greeting);
});

app.get('/api/v1/bill', (req, res) => {
  const query = req.query;
  console.log(query);
  res.send('This is a test.')
})

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});

server.on('error', console.error);

const job = schedule.scheduleJob({hour: [5, 17], minute: 0}, SyncUtils.syncDb);