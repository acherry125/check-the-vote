const searchByChamberAndBillNumber  = (chamber: String, billNumber: String): Promise<Response> => {
  return fetch(`/api/v1/bills/${chamber}/${billNumber}`);
}

export default {
  searchByChamberAndBillNumber
}