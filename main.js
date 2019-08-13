const ctx = document.getElementById('myChart').getContext('2d');
const dropdownMenu = document.querySelector('.dropdown-option-menu');
const accesKey = '92a45179da9f47cc64e7c4a4e9ba75fb';
const currencySymbols = 'symbols'
const date = document.querySelector('.date');
const rate = document.querySelector('.rate');
const currencyName = document.querySelector('.currency-name');
const btnWeeklyExchange = document.querySelector('.weekly-exchange');

const currencyConverter = (data) => {
    const exchangeRates = data.rates;

    for (const currency in exchangeRates) {
        const mexicanPeso = exchangeRates.MXN;
        const currencyRate = exchangeRates[currency];
        const currencyCode = currency;

        dropdownMenu.innerHTML += `
        <option value="${currencyRate / mexicanPeso}" class="dropdown-item">${currencyCode}</option>`;
    }

    const convertedRate = Number(dropdownMenu.options[dropdownMenu.selectedIndex].value);
    const optioncurrencyCode = dropdownMenu.options[dropdownMenu.selectedIndex].text;

    rate.textContent = `${convertedRate.toFixed(3)}`;
    currencyName.textContent = `${optioncurrencyCode}`;

}

const formatDate = (date) => {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

const getLastWeek = () => {
    const daysOffWeek = 7;
    const days = [];

    for (let i = 0; i <= daysOffWeek; i++) {
        const date = new Date() - ((daysOffWeek >= 0 ? i : (i - i - i)) * 24 * 60 * 60 * 1000);
        const day = new Date(date)
        const format = formatDate(day);
        days.push(format);
    }

    const fetchArr =
        Promise.all(days.map(d => fetch(`http://data.fixer.io/api/${d}?access_key=${accesKey}&symbols=USD`)
            .then(res => res.json())
            .then(data => console.log(data))
        ));
    console.log(fetchArr);

}

const fetchCurrencies = () => {
    fetch(`http://data.fixer.io/api/latest?access_key=${accesKey}&${currencySymbols}`)
        .then((response) => response.json())
        .then(currencyConverter);
}

fetchCurrencies();
dropdownMenu.addEventListener('change', currencyConverter);
window.addEventListener('load', () => date.textContent = Date());
btnWeeklyExchange.addEventListener('click', getLastWeek);