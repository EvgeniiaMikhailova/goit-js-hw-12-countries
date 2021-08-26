import '../sass/main.scss';
import fetchCountries from './fetchCountries.js';
import markupCountry from '../templates/country-card.hbs';
import markupList from '../templates/country-list.hbs';
import { alert, notice, info, success, error, defaults } from '../../node_modules/@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';
defaults.delay = 2500;
const debounce = require('lodash.debounce');


const refs = {
  searchForm: document.querySelector('.input-field'),
  countryContainer: document.querySelector('.country-info-container')
}

refs.searchForm.addEventListener('input', debounce(onInputChange, 500));

function onInputChange(e) {
  const searchQuery = e.target.value.trim('');
  if (searchQuery === '') {
    refs.countryContainer.textContent = '';
    return;
  }
  
  console.log(searchQuery);
  fetchCountries(searchQuery)
    // .then(response => response.json())
    // .then(data => console.log(data))
  
    .then(response => (response.ok ? response.json() : Promise.reject(response)))
    .then(renderCountryCard)
    .catch(onFetchError);

  function renderCountryCard(countries) {
    if (countries.length === 1) {
      refs.countryContainer.innerHTML = markupCountry(countries[0]);
      success({ text: `Search results:` });
      return;
    } else if (countries.length > 1 && countries.length <= 10) {
        refs.countryContainer.innerHTML = markupList(countries);
         info({ text: `Searching` });
        return;
    } else if (countries.length > 10) {
       info({ text: `Too many matches found. Please enter more specific query!` });
      return;
      }
    }
    
  function onFetchError(err) {
    if (err.status === 404) {
      error({ text: `Error! This country not find.` });
      return;
    } 
  }
  }