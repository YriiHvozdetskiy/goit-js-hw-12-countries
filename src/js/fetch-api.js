import countriesTpl from '../tampletes/country.hbs';
import makeListCountryName from '../tampletes/countryListName.hbs';
import API from './api-service';
import { refs } from './get-refs';
const debounce = require('lodash.debounce');

import { alert, defaults, Stack } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';

const myStack = new Stack({
  dir1: 'down',
  dir2: 'left',
  firstpos1: 25,
  firstpos2: 25,
  spacing1: 36,
  spacing2: 36,
  push: 'bottom',
  context: document.body,
});

const option = {
  text: 'To many matches found. Please enter a more specific query!',
  type: 'error',
  delay: 99000,
  labels: { close: 'Close', stick: 'Pin', unstick: 'Unpin' },
  stack: myStack,
};

const myAlert = alert;

function whenNoCountry() {
  renderCountries('');
  console.log('Country is not defined!');
  return myAlert({
    text: 'Country is not defined!',
    type: 'error',
    delay: 99000,
    stack: myStack,
  });
}

function tooLongList() {
  renderCountries('');
  console.log('ведіть точнішу назву');
  return myAlert(option);
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
      return console.log('error', error);
    });
}

function renderCountries(item) {
  if (typeof item === 'object' || item === undefined) return;

  refs.markup.innerHTML = item;
}
