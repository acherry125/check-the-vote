const superagent = require('superagent');
const _ = require('lodash');

const CONGRESS_API_BASE_URL = 'https://api.propublica.org/congress/v1/';
const AUTH_HEADER = 'X-API-Key';
const OFFSET = 'offset';
const OFFSET_INCREMENT = 20;

const createQueryString = (query = []) => {
  if (!_.isEmpty(query)) {
    const queryString = _.join(
      _.map(query, (val, key) => key + '=' + 'val'),
      '&'
    );
    return '?' + queryString;
  }
  return '';
};

const createCongressChamberEndpoint = (
  congressNumber,
  chamber,
  apiType,
  resource,
  query
) => {
  const queryString = createQueryString(query);
  return `${congressNumber}/${chamber}/${apiType}/${resource}/${queryString}`;
};

const createCongressChamberBaseResourceEndpoint = (
  congressNumber,
  chamber,
  resource,
  query
) => {
  const queryString = createQueryString(query);
  return `${congressNumber}/${chamber}/${resource}/${queryString}`;
};

const createChamberEndpoint = (chamber, apiType, resource, query) => {
  const queryString = createQueryString(query);
  return `${chamber}/${apiType}/${resource}/${queryString}`;
};

const createGenericEndpoint = (apiType, resource, query) => {
  const queryString = createQueryString(query);
  return `${apiType}/${resource}/${queryString}`;
};

const nextPage = (endpoint, result) => {
  let finalEndpoint = endpoint;
  const endpointParts = _.split(endpoint, '?');
  let endpointWithoutQuery, query;
  if (endpointParts.length > 1) {
    endpointWithoutQuery = endpointParts[0];
    query = endpointParts[1];
    let queryParts = _.split(query, '&');
    _.remove(queryParts, (q) => {
      let qParts = _.split('=');
      return _.toLower(qParts[0]) === OFFSET;
    });
    endpointWithoutQuery = _.join(queryParts, '&');
    finalEndpoint = endpoint + '?' + query;
  } else {
    finalEndpoint = finalEndpoint + '?';
  }
  const currOffset = _.get(result, 'results.offset');
  const newOffset = _.toNumber(currOffset) + OFFSET_INCREMENT;
  return `${finalEndpoint}${OFFSET}=${newOffset}`;
};

const handleResponseBody = (body, requestCount) => {
  const { results } = body;
  const count = _.get(results, [0, 'num_results']);
  const offset = _.get(results, [0, 'offset']);

  console.log(`API has responded with ${count} results at offset ${offset}`);

  return results;
};

const handleResponse = (response) => {
  if (response.ok && response.status === 200) {
    return response.body;
  } else {
    return Promise.reject('Response not ok.');
  }
};

const requestCongressPage = (pageURL, count = 0) => {
  console.log(
    'Attempting to request page at ' + pageURL + ' with count ' + count
  );
  const urlToCall = CONGRESS_API_BASE_URL + pageURL;
  const apiKey = process.env.PRO_CONGRESS_API_KEY;
  if (apiKey) {
    return superagent
      .get(urlToCall)
      .set(AUTH_HEADER, apiKey)
      .then(handleResponse)
      .then((res) => handleResponseBody(res, count))
      .catch((err) => {
        console.error('Error GETing ' + CONGRESS_API_BASE_URL + pageURL);
        return {
          status: err.status,
          text: _.get(err, 'response.error.text'),
          stackTrace: _.get(err, 'response.error.Error'),
        };
      });
  } else {
    const err =
      'Did not attempt API call, service missing api key in environment variables';
    return Promise.reject(err);
  }
};

export default {
  CONGRESS_API_BASE_URL,
  createCongressChamberEndpoint,
  createCongressChamberBaseResourceEndpoint,
  createGenericEndpoint,
  createChamberEndpoint,
  requestCongressPage,
};
