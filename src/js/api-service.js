const BASE_URL = 'https://restcountries.eu/rest/v2/name/';

function fetchCountriesByName(name) {
  return fetch(`${BASE_URL}${name}`).then(response => {
    return response.json();
  });
}

export default { fetchCountriesByName };
