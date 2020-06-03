export const BILLS_TABLE_DEFINITION = {
  TableName: "Bills",
  KeySchema: [
    { AttributeName: "cngrNmbr", KeyType: "HASH" },
    { AttributeName: "billNmbr", KeyType: "RANGE" }
  ],
  AttributeDefinitions: [
    { AttributeName: "cngrNmbr", AttributeType: "N" },
    { AttributeName: "billNmbr", AttributeType: "S" }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  }
};