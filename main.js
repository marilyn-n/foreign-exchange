const ctx = document.getElementById('myChart').getContext('2d');
const dropdownMenu = document.querySelector('.dropdown-option-menu');
const accesKey = '92a45179da9f47cc64e7c4a4e9ba75fb';
const currencySymbols = '&symbols=USD,CAD,EUR,AUD,PLN,GBP,JPY,MXN'
const date = document.querySelector('.date');
const rate = document.querySelector('.rate');
const currencyName = document.querySelector('.currency-name');

const currencyConverter = (data) => {
    const exchangeRates = data.rates;

    for (const currency in exchangeRates) {
        const mexicanPeso = exchangeRates.MXN;
        const currencyRate = exchangeRates[currency];
        const currencyCode = currency;

        dropdownMenu.innerHTML += `
            <option value="${currencyRate / mexicanPeso}">${currencyCode}</option>
        `;
    }

    const convertionRate = Number(dropdownMenu.options[dropdownMenu.selectedIndex].value);
    const currencyTextValue = dropdownMenu.options[dropdownMenu.selectedIndex].text;
    rate.textContent = `${convertionRate.toFixed(3)}`;
    currencyName.textContent = `${currencyTextValue}`;

}

const fetchCurrencies = () => {
    fetch(`http://data.fixer.io/api/latest?access_key=${accesKey}&${currencySymbols}`)
        .then((response) => response.json())
        .then(currencyConverter);
}

fetchCurrencies();
dropdownMenu.addEventListener('change', currencyConverter);
window.addEventListener('load', () => date.textContent = Date());