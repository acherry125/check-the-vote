export const BILLS_TABLE_DEFINITION = {
  TableName: 'Bills',
  KeySchema: [
    { AttributeName: 'cngrNmbr', KeyType: 'HASH' },
    { AttributeName: 'billNmbr', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'cngrNmbr', AttributeType: 'N' },
    { AttributeName: 'billNmbr', AttributeType: 'S' },
    { AttributeName: 'billName', AttributeType: 'S' },
  ],
  LocalSecondaryIndexes: [
    {
      IndexName: 'billName_index',
      KeySchema: [
        {
          AttributeName: 'cngrNmbr',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'billName',
          KeyType: 'RANGE',
        },
      ],
      Projection: {
        ProjectionType: 'ALL'
      }
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};
