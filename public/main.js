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

const listOfTopCurrencies = document.querySelector('.top-currencies');

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
    const rates = data.rates;

    for (const cur in rates) {
        const MXN = rates.MXN;
        const rate = rates[cur];

        dropdownMenu.innerHTML += `<option value="${rate / MXN}" class="dropdown-item">${cur}</option>`;
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
        month = '' + (d.getMonth() +1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function historicalWeek() {
    const currencySymbol = currencyName.textContent;
    fetch(`https://api.exchangeratesapi.io/history?start_at=2019-09-01&end_at=2019-09-15&symbols=${currencySymbol},MXN`)
    .then(res => res.json())
        .then(data => {
            console.log(data);
            
            const entries = Object.entries(data.rates);
            entries.map(item => item)
            entries.sort();

            const dates = entries.map(d => d[0])

            const rates = []
            const currencyRates = entries.map(r => r[1])

            for (const key in currencyRates) {
                rates.push((currencyRates[key][currencySymbol] / currencyRates[key]['MXN']).toFixed(3))
            }

            console.log(dates, 'dates');
            console.log(rates, 'rates');

            const summaryRates = rates.map(item => parseFloat(item));
            const average = summaryRates.reduce((accumulator, currentValue) => accumulator + currentValue );
            
            lowValue.textContent = `$${Math.min(...summaryRates)}`;
            highValue.textContent = `$${Math.max(...summaryRates)}`;
            averageValue.textContent = `$${(average / summaryRates.length).toFixed(3)}`;

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
    const rates = data.rates;
    const topCurrencies = ['USD', 'GBP', 'CAD', 'JPY', 'AUD'];
    const MXN = rates['MXN'];

    topCurrencies.map(cur => {
        const rate = (rates[cur] / MXN ).toFixed(3)

        listOfTopCurrencies.innerHTML += `
        <li class="list-group-item w-100 text-center">
            <b class="top-currency d-block">${cur}</b>
            <span class="top-rate">${rate}</span>
        </li>`
    })

}

const validateInput = () => {
    if (isNaN(inputAmount.value)) {
        btnConvert.setAttribute('disabled', true);
        inputError.classList.remove('d-none');
    } else {
        btnConvert.removeAttribute('disabled');
        inputError.classList.add('d-none');
    }
}

const fetchCurrencies = () => {
    fetch(`https://api.exchangeratesapi.io/latest`)
        .then(response => response.json())
        .then(currencyConverter)
        .then(historicalWeek);
}

const fetchTopCurrencies = () => {
    fetch(`https://api.exchangeratesapi.io/latest?symbols`)
        .then(res => res.json())
        .then(topCurrencies)
}

// hook up events and function calls
fetchCurrencies();
fetchTopCurrencies();

btnConvert.addEventListener('click', currencyConverter);
btnConvert.addEventListener('click', convertFrom);
btnConvert.addEventListener('click', historicalWeek);

inputAmount.addEventListener('keyup', validateInput);
window.addEventListener('load', () => {
    setInterval(() => {
        date.textContent = new Date()
    }, 1000);
});