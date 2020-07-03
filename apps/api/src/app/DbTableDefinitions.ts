export const BILLS_TABLE_DEFINITION = {
  TableName: 'Bills',
  KeySchema: [
    { AttributeName: 'billNmbr', KeyType: 'HASH' },
    { AttributeName: 'session', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'billNmbr', AttributeType: 'S' },
    { AttributeName: 'chamber', AttributeType: 'S' },
    { AttributeName: 'session', AttributeType: 'N' }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'billNmbr_chamber',
      KeySchema: [
        {
          AttributeName: 'billNmbr',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'chamber',
          KeyType: 'RANGE',
        }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    },
    {
      IndexName: 'session_chamber',
      KeySchema: [
        {
          AttributeName: 'session',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'chamber',
          KeyType: 'RANGE',
        }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1 
      }
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};
