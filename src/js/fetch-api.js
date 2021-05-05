import countriesTpl from '../tampletes/country.hbs';
import makeListCountryName from '../tampletes/countryListName.hbs';
import API from './api-service';
import { refs } from './get-refs';
const debounce = require('lodash.debounce');

import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/Material.css';
import '@pnotify/core/dist/PNotify.css';

const myError = error;

function whenNoCountry() {
  renderCountries('');
  return myError({
    text: 'Country is not defined!',
    delay: 2500,
  });
}

function tooLongList() {
  renderCountries('');
  return myError({
    text: 'To many matches found. Please enter a more specific query!',
    delay: 2500,
  });
}

refs.input.addEventListener('input', debounce(onInput, 500));

function onInput(e) {
  const name = e.target.value;

  API.fetchCountriesByName(name)
    .then(country => {
      if (country.length >= 2 && country.length <= 10) return makeListCountryName(country);
      if (country.length > 10) return tooLongList();
      if (country.status === 404) return whenNoCountry();

      return countriesTpl(country);
    })
    .then(renderCountries)
    .catch(error => {
      renderCountries('');
    });
}

function renderCountries(item) {
  if (typeof item === 'object' || item === undefined) return;

  refs.markup.innerHTML = item;
}
