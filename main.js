const ctx = document.getElementById('myChart').getContext('2d');

const accesKey = '92a45179da9f47cc64e7c4a4e9ba75fb';
const date = '2000-01-03';
const allCurrencies = '&symbols=USD,CAD,EUR,AUD,MXN,PLN,GBP'

const currencySelector = document.querySelector('.currency-options');
const mxnCurrencie = 'symbols=MXN';
const currentDate = document.querySelector('.date');
const rate = document.querySelector('.rate');

const convertFx = () => {
    fetch(`http://data.fixer.io/api/latest?access_key=${accesKey}&${mxnCurrencie}`) // get mxn rate
        .then((response) => response.json())
        .then(data => {
            const mexicanPeso = data.rates.MXN;
            const convertion = currencySelector.value / mexicanPeso;
            const currencyName = currencySelector.options[currencySelector.selectedIndex].text;
            if (currencySelector.options[currencySelector.selectedIndex].classList.contains('default')) {
                rate.classList.add('d-none');
            } else {
                rate.classList.remove('d-none');
            }
            rate.textContent = `${convertion.toFixed(3)} ${currencyName}`;
        });
}

currencySelector.addEventListener('change', convertFx);

window.addEventListener('load', () => {
    currentDate.textContent = Date();
})


fetch(`http://data.fixer.io/api/${date}?access_key=${accesKey}&${allCurrencies}`)
    .then((response) => response.json())
    .then(data => {
        const mxn = data.rates.MXN;
        const rates = Object.values(data.rates);

        const convertionRate = rates.map(item => item.toFixed(3))
        const currencyCodes = Object.keys(data.rates);


        console.log(data, '***');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: currencyCodes,
                datasets: [{
                    label: 'MXN',
                    data: convertionRate,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1,
                    fill: false,
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
        })
    })