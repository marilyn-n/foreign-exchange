// selectors
const ctx = document.getElementById('myChart').getContext('2d');
const dropdownMenu = document.querySelector('.dropdown-option-menu');
const date = document.querySelector('.date');
const rate = document.querySelector('.rate');
const currencyName = document.querySelector('.currency-name');
const input = document.querySelector('input');
const btnConvert = document.querySelector('.convert');
const inputAmount = document.querySelector('.amount');
const inputError = document.querySelector('.error-message');
const totalAmountConverted = document.querySelector('.total-converted');

const lowValue = document.querySelector('.low-value');
const averageValue = document.querySelector('.average-value');
const highValue = document.querySelector('.high-value');
const h1 = document.querySelector('h1');
const summaryTitle = document.querySelector('.summary-rate');
const historicalDetails = document.querySelector('.historical-details');
const historicalBtns = document.querySelectorAll('button[type="button"]');


// API url
const accesKey = 'af1df608b7578b3a6cf8c34a07436951';
const currencySymbols = 'symbols';
const topSymbols = 'symbols=USD,CAD,EUR,GBP,AUD,JPY,MXN';

// functions
const convertFrom = () => {
    const amount = inputAmount.value;
    if (amount > 0) {
        const currencyToConvert = Number(dropdownMenu.options[dropdownMenu.selectedIndex].value);
        const currencySymbol = dropdownMenu.options[dropdownMenu.selectedIndex].text;
        const fixNumber = (amount * currencyToConvert).toFixed(3);
        const total = Number(fixNumber).toLocaleString();

        if (totalAmountConverted.style.opacity == 0) {
            totalAmountConverted.style.opacity = 1;
        }

        return totalAmountConverted.textContent = `$${total} ${currencySymbol}`;

    } else {
        totalAmountConverted.textContent = ``;
        return;
    }

}

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
    const optionCurrencyCode = dropdownMenu.options[dropdownMenu.selectedIndex].text;

    rate.textContent = `$${convertedRate.toFixed(3)}`;
    currencyName.textContent = `${optionCurrencyCode}`;
    h1.textContent = `# MXN to ${optionCurrencyCode}`;
    summaryTitle.textContent = `${optionCurrencyCode}`;

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


function historicalRates(historicalDays) {
    historicalDays = 7;
    const currencySymbol = currencyName.textContent;
    const days = [];

    for (let i = 0; i <= historicalDays; i++) {
        const date = new Date() - ((historicalDays >= 0 ? i : (i - i - i)) * 24 * 60 * 60 * 1000);
        const day = new Date(date)
        days.push(formatDate(day));
    }

    const test = ['2019-08-12']
    Promise.all(days.map(d => fetch(`http://data.fixer.io/api/${d}?access_key=${accesKey}&symbols=${currencySymbol},MXN`)))
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(data => {

            const dates = data.map(item => item['date']);
            const rates = data
                .map(item => item['rates'])
                .map(rate => (rate[currencySymbol] / rate['MXN']).toFixed(3));

            const summaryRates = rates.map(item => parseFloat(item));
            const average = summaryRates.reduce((accumulator, currentValue) => accumulator + currentValue);

            lowValue.textContent = `$${Math.min(...summaryRates)}`;
            highValue.textContent = `$${Math.max(...summaryRates)}`;
            averageValue.textContent = `$${average.toFixed(3)}`;

            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: `# MXN Against ${currencySymbol}`,
                        data: rates,
                        borderColor: [
                            'rgb(14, 157, 88)'
                        ],
                        borderWidth: 2,
                        pointBackgroundColor: 'rgb(14, 157, 88)',
                        lineTension: 0
                    }],

                },
                options: {
                    legend: {
                        labels: {
                            fontColor: "white",
                            fontSize: 18
                        }
                    },
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Closing Rates ($)',
                                fontColor: 'white'
                            },
                            ticks: {
                                fontColor: 'white',
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontColor: "white",
                            }
                        }]
                    }
                }
            });

        });

}

const topCurrencies = (data) => {
    const topRates = data.rates;
    const mxn = data.rates.MXN;

    delete topRates['MXN']; // remove from the table of top rates

    for (const topRate in topRates) {
        const valueRate = (topRates[topRate] / mxn).toFixed(3);
        const tableRowSymbol = document.querySelector('.tr-symbol');
        const tableRowRate = document.querySelector('.tr-rate');

        tableRowSymbol.innerHTML += `
            <th class="text-center" scope="col">${topRate}</th>
        `;

        tableRowRate.innerHTML += `
            <td class="text-center">${valueRate}</td>
        `;

    }

}

const validateInput = (e) => {
    const inputValue = inputAmount.value;
    if (isNaN(inputValue)) {
        btnConvert.setAttribute('disabled', true);
        inputError.classList.remove('d-none');
        return false;
    } else {
        btnConvert.removeAttribute('disabled');
        inputError.classList.add('d-none');
        return true;
    }
}

const fetchCurrencies = () => {
    fetch(`http://data.fixer.io/api/latest?access_key=${accesKey}&${currencySymbols}`)
        .then((response) => response.json())
        .then(currencyConverter)
        .then(historicalRates);
}

const fetchTopCurrencies = () => {
    fetch(`http://data.fixer.io/api/latest?access_key=${accesKey}&${topSymbols}`)
        .then((res) => res.json())
        .then(topCurrencies)
}

// hook up events and function calls
fetchCurrencies();
fetchTopCurrencies();

btnConvert.addEventListener('click', currencyConverter);
btnConvert.addEventListener('click', historicalRates);
btnConvert.addEventListener('click', convertFrom);

inputAmount.addEventListener('keyup', validateInput);
window.addEventListener('load', () => {
    setInterval(() => {
        date.textContent = new Date()
    }, 1000);
});