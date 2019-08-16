const ctx = document.getElementById('myChart').getContext('2d');
const accesKey = 'af1df608b7578b3a6cf8c34a07436951';
const currencySymbols = 'symbols';
const dropdownMenu = document.querySelector('.dropdown-option-menu');
const date = document.querySelector('.date');
const rate = document.querySelector('.rate');
const currencyName = document.querySelector('.currency-name');
// const input = document.querySelector('input');

const btnConvert = document.querySelector('.convert');
const inputAmount = document.querySelector('.amount');
const totalAmountConverted = document.querySelector('.total-converted');

const convertFrom = () => {
    const amount = inputAmount.value;
    const currencyToConvert = Number(dropdownMenu.options[dropdownMenu.selectedIndex].value);
    const currencySymbol = dropdownMenu.options[dropdownMenu.selectedIndex].text;
    const total = (amount * currencyToConvert).toFixed(3);
    totalAmountConverted.parentElement.classList.add('total-details');
    return totalAmountConverted.textContent = `$${total} ${currencySymbol}`;
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

    Promise.all(days.map(d => fetch(`http://data.fixer.io/api/${d}?access_key=${accesKey}&symbols=${symbolCurrency},MXN`)))
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(data => {

            const dates = data.map(item => item['date']);
            const rates = data
                .map(item => item['rates'])
                .map(rate => (rate[symbolCurrency] / rate['MXN']).toFixed(3));

            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: `# MXN Against ${symbolCurrency}`,
                        data: rates,
                        backgroundColor: [
                            'rgb(237, 247, 242)'
                        ],
                        borderColor: [
                            'rgb(14, 157, 88)'
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
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
dropdownMenu.addEventListener('change', currencyConverter);
// dropdownMenu.addEventListener('change', historicalWeek);
window.addEventListener('load', () => {
    setInterval(() => {
        date.textContent = new Date()
    }, 1000);
});
btnConvert.addEventListener('click', convertFrom);
inputAmount.addEventListener('keyup', validateInput)