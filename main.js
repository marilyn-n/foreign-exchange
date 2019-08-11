const ctx = document.getElementById('myChart').getContext('2d');
const dropdownCurrencies = document.querySelector('.dropdown-currencies');

const accesKey = '92a45179da9f47cc64e7c4a4e9ba75fb';
const allCurrencies = '&symbols=USD,CAD,EUR,AUD,PLN,GBP,JPY,MXN'
const mxnCurrency = '&symbols=MXN'
const currencySelector = document.querySelector('.currency-options');
const currentDate = document.querySelector('.date');
const rate = document.querySelector('.rate');
const rateName = document.querySelector('.rate-name');

const displayCurrency = (data) => {
    const rates = data.rates;

    for (const currency in rates) {
        const mexicanPeso = rates.MXN;
        const rateValue = rates[currency];
        const nameOfCurrency = currency;

        dropdownCurrencies.innerHTML += `
            <option value="${rateValue / mexicanPeso}">${nameOfCurrency}</option>
        `;
    }

    const currencyName = dropdownCurrencies.options[dropdownCurrencies.selectedIndex].textContent;
    const convertionRate = Number(dropdownCurrencies.options[dropdownCurrencies.selectedIndex].value);

    rate.textContent = `${convertionRate.toFixed(3)}`;
    rateName.textContent = `${currencyName}`;

}

function fetchCurrencies() {
    fetch(`http://data.fixer.io/api/latest?access_key=${accesKey}&${allCurrencies}`)
        .then((response) => response.json())
        .then(displayCurrency);
}

fetchCurrencies();
dropdownCurrencies.addEventListener('change', displayCurrency);
window.addEventListener('load', () => currentDate.textContent = Date());