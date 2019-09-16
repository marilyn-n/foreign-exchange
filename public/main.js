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


function historicalWeek(week) {
    week = 7;
    const currencySymbol = currencyName.textContent;
    const days = [];

    for (let i = 0; i <= week; i++) {        
        const time = ((week >= 0 ? i : i - i - i ) * 24 * 60 * 60 * 1000)
        const date = new Date() - time ;
        const day = new Date(date)
        days.push(formatDate(day));
    }
    
    fetch(`https://api.exchangeratesapi.io/history?start_at=${days[7]}&end_at=${days[0]}&symbols=${currencySymbol},MXN`)
    .then(res => res.json())
        .then(data => {
            const objData = data.rates;

            const dates = []
            const rates = []

            for (key in objData) {
                dates.push(key)
                rates.push((objData[key][currencySymbol] / objData[key]['MXN']).toFixed(3))
            }

            // console.log(dates);
            // console.log(rates);

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
    console.log(data);  
    const rates = data.rates;

    const topCurrencies = ['USD', 'GBP', 'CAD', 'JPY', 'MXN'];

    topCurrencies.map(cur => {
        const tableRowSymbol = document.querySelector('.tr-symbol');
        const tableRowRate = document.querySelector('.tr-rate');

        tableRowSymbol.innerHTML += 
        `<td class="text-center">${cur}</td>`
        tableRowRate.innerHTML += 
        `<td class="text-center">${(rates[cur] / rates['MXN']).toFixed(3) }</td>`;
    })
    
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
    fetch(`https://api.exchangeratesapi.io/latest`)
        .then((response) => response.json())
        .then(currencyConverter)
        .then(historicalWeek);
}

const fetchTopCurrencies = () => {
    fetch(`https://api.exchangeratesapi.io/latest?symbols`)
        .then((res) => res.json())
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