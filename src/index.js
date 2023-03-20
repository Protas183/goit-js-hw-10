import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener ('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(e) {
  const countryName = e.target.value.trim();

  if (!countryName) {
    clearTemplate();
    return;
  }

  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        specificNameInfo();
        clearTemplate();
        return;
      }
      renderTemplate(data);
    })
    .catch(error => {
      clearTemplate();
      errorWarn();
    });
}

function renderTemplate(e) {
  let template = '';
  let refsTemplate = '';
  clearTemplate();

  if (e.length === 1) {
    template = createTemplateItem(e);
    refsTemplate = countryInfo;
  } else {
    template = createTemplateItemList(e);
    refsTemplate = countryList;
  }
  drawTemplate(refsTemplate, template);
}

function createTemplateItem(e) {
  return e.map(
    ({ name, capital, population, flags, languages }) =>
      `<img
        src="${flags.svg}"
        alt="${name.official}"
        width="120"
        height="80">
      <h1 class="country-info__title">${name.official}</h1>
      <ul class="country-info__list">
          <li class="country-info__item">
          <span>Capital:</span>
        ${capital}
          </li>
          <li class="country-info__item">
          <span>Population:</span>
          ${population}
          </li>
          <li class="country-info__item">
          <span>Lenguages:</span>
          ${Object.values(languages)}
          </li>
      </ul>`
  );
}

function createTemplateItemList(elements) {
  return elements
    .map(
      ({ name, flags }) => `
      <li class="country-list__item">
        <img class="country-list__img"
          src="${flags.svg}"
          alt="${name.official}"
          width="60"
          height="40">
        ${name.official}
      </li>`
    )
    .join('');
}

function specificNameInfo() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function errorWarn() {
  Notify.failure(`Oops, there is no country with that name`);
}

function clearTemplate() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

function drawTemplate(refs, markup) {
  refs.innerHTML = markup;
}