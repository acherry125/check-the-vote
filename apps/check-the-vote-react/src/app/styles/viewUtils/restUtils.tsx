const searchByChamberAndBillNumber  = (chamber: String, billNumber: String): Promise<Response> => {
  return fetch(`/api/v1/bill?number=${chamber}${billNumber}`);
}

export default {
  searchByChamberAndBillNumber
}