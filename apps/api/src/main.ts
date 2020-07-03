import * as express from 'express';
import { Message } from '@check-the-vote/api-interfaces';
import DbUtils from './app/DbUtils';
import SyncUtils from './app/SyncUtils';
import * as _ from 'lodash';
import { BillRequestType } from '@check-the-vote/common/types';


var schedule = require('node-schedule');

const app = express();

const greeting: Message = { message: 'Welcome to api!' };

app.get('/api', (req, res) => {
  res.send(greeting);
});

app.get('/api/v1/admin/sync', (req, res) => {
  const latestCongress = 116;
  const earliestAvailableCongress = 103;

  SyncUtils.syncDb(latestCongress, earliestAvailableCongress)
    .then(apiRes => {
      res.send('OK');
    })
    .catch(err => {
      res.send('Bad');
    })
})

app.get('/api/v1/bills/:chamber/:billNumber', (req: BillRequestType, res) => {
  const { params } = req;
  console.log(params);
  DbUtils.getBillsByChamberAndBillNumber(params.chamber, params.billNumber)
    .then(dbResponse => {
      res.send(_.flatMap(dbResponse))
    })
    .catch(err => res.status(500).send({ error: err }))
})

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});

server.on('error', console.error);

DbUtils.createBillsTable();

// const job = schedule.scheduleJob({hour: [5, 17], minute: 0}, SyncUtils.syncDb);

