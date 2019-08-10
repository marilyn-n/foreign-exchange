const ctx = document.getElementById('myChart').getContext('2d');
const dropdownCurrencies = document.querySelector('.dropdown-currencies');

const accesKey = '92a45179da9f47cc64e7c4a4e9ba75fb';
const allCurrencies = '&symbols=USD,CAD,EUR,AUD,PLN,GBP,JPY,MXN'
const mxnCurrency = '&symbols=MXN'
const currencySelector = document.querySelector('.currency-options');
const currentDate = document.querySelector('.date');
const rate = document.querySelector('.rate');

const displayCurrency = (data) => {
    console.log(data);
    const rates = data.rates;
    for (const currency in rates) {
        const rateValue = rates[currency];
        const nameOfCurrency = currency;
        dropdownCurrencies.innerHTML += `<option value="${rateValue}">${nameOfCurrency}</option>`;
    }
    const options = document.querySelectorAll('option');
    const mexicanPeso = data.rates.MXN;
    console.log(data.rates.MXN);

    [...options].map(item => {

        const currencyValue = item.value;
        const convertion = currencyValue / mexicanPeso;

        const currencyName = dropdownCurrencies.options[dropdownCurrencies.selectedIndex].text;

        rate.textContent = `${convertion.toFixed(3)} ${currencyName}`;


    });

}

function fetchCurrencies() {
    fetch(`http://data.fixer.io/api/latest?access_key=${accesKey}&${allCurrencies}`)
        .then((response) => response.json())
        .then(displayCurrency);
}

fetchCurrencies();
dropdownCurrencies.addEventListener('change', displayCurrency);
window.addEventListener('load', () => currentDate.textContent = Date());
// const convertFx = () => {
//     fetch(`http://data.fixer.io/api/latest?access_key=${accesKey}&${mxnCurrency}`) // get mxn rate
//         .then((response) => response.json())
//         .then(data => {
//             const mexicanPeso = data.rates.MXN;
//             const convertion = currencySelector.value / mexicanPeso;
//             const currencyName = currencySelector.options[currencySelector.selectedIndex].text;

//             if (currencySelector.options[currencySelector.selectedIndex].classList.contains('default')) {
//                 rate.classList.add('d-none');
//             } else {
//                 rate.classList.remove('d-none');
//             }
//             rate.textContent = `${convertion.toFixed(3)} ${currencyName}`;

//         });
// }

// currencySelector.addEventListener('change', convertFx);