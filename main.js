const ctx = document.getElementById('myChart').getContext('2d');
const accesKey = 'af1df608b7578b3a6cf8c34a07436951';
const currencySymbols = 'symbols';
const dropdownMenu = document.querySelector('.dropdown-option-menu');
const date = document.querySelector('.date');
const rate = document.querySelector('.rate');
const currencyName = document.querySelector('.currency-name');
const input = document.querySelector('input');
const h1 = document.querySelector('h1');
const btnConvert = document.querySelector('.convert');
const inputAmount = document.querySelector('.amount');
const totalAmountConverted = document.querySelector('.total-converted');

const lowValue = document.querySelector('.low-value');
const averageValue = document.querySelector('.average-value');
const highValue = document.querySelector('.high-value');
const summaryRatesTitle = document.querySelector('.summary-rate');
const historicalDetails = document.querySelector('.historical-details');


const convertFrom = () => {
    const amount = inputAmount.value;
    if (amount > 0) {
        const currencyToConvert = Number(dropdownMenu.options[dropdownMenu.selectedIndex].value);
        const currencySymbol = dropdownMenu.options[dropdownMenu.selectedIndex].text;
        const total = (amount * currencyToConvert).toFixed(3);
        totalAmountConverted.parentElement.classList.remove('d-none');
        return totalAmountConverted.textContent = `$${total} ${currencySymbol}`;
    } else {
        totalAmountConverted.textContent = ``;
        totalAmountConverted.parentElement.classList.add('d-none');
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
    summaryRatesTitle.textContent = `${optionCurrencyCode}`;

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

const historicalWeek = () => {
    const daysOffWeek = 7;
    const symbolCurrency = currencyName.textContent;
    const days = [];

    for (let i = 0; i <= daysOffWeek; i++) {
        const date = new Date() - ((daysOffWeek >= 0 ? i : (i - i - i)) * 24 * 60 * 60 * 1000);
        const day = new Date(date)
        days.push(formatDate(day));
    }

    const test = ['2019-08-12', '2019-08-13'] // ${days}

    Promise.all(test.map(d => fetch(`http://data.fixer.io/api/${d}?access_key=${accesKey}&symbols=${symbolCurrency},MXN`)))
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(data => {

            const dates = data.map(item => item['date']);
            const rates = data
                .map(item => item['rates'])
                .map(rate => (rate[symbolCurrency] / rate['MXN']).toFixed(3));

            const summaryRates = rates.map(item => parseFloat(item));
            const average = summaryRates.reduce((accumulator, currentValue) => accumulator + currentValue);

            lowValue.textContent = `$${Math.min(...summaryRates)}`;
            highValue.textContent = `$${Math.max(...summaryRates)}`;
            averageValue.textContent = `$${average}`;

            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: `# MXN Against ${symbolCurrency}`,
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

const fetchCurrencies = () => {
    fetch(`http://data.fixer.io/api/latest?access_key=${accesKey}&${currencySymbols}`)
        .then((response) => response.json())
        .then(currencyConverter);
}

const validateInput = (e) => {
    var x = inputAmount.value;
    if (isNaN(x)) {
        btnConvert.setAttribute('disabled', true);
        document.querySelector('.input-validation').classList.remove('d-none');
        return false;
    } else {
        btnConvert.removeAttribute('disabled');
        document.querySelector('.input-validation').classList.add('d-none');
        return true;
    }
}

fetchCurrencies();
window.addEventListener('load', () => {
    setInterval(() => {
        date.textContent = new Date()
    }, 1000);
});

btnConvert.addEventListener('click', currencyConverter);
btnConvert.addEventListener('click', historicalWeek);
btnConvert.addEventListener('click', convertFrom);

inputAmount.addEventListener('keyup', validateInput);