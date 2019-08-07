// `http://data.fixer.io/api/${date}?access_key=${accesKey}&${currencies}`

const ctx = document.getElementById('myChart').getContext('2d');
const currencyOptions = document.querySelector('.currency-options');

const accesKey = '92a45179da9f47cc64e7c4a4e9ba75fb';
const allCurrencies = 'symbols=USD,AUD,CAD,PLN';
const mexicanPesoCurrencie = 'symbols=MXN';
const date = '2000-01-03';
const defaultCurrency = document.querySelector('option[selected]');
const currentDate = document.querySelector('.date');
const rate = document.querySelector('.rate');


function convertFx() {
    // get mxn rate
    fetch(`http://data.fixer.io/api/latest?access_key=${accesKey}&${mexicanPesoCurrencie}`)
        .then((response) => response.json())
        .then(data => {
            const mexicanPeso = data.rates.MXN;
            const equalsTo = this.value / mexicanPeso;
            rate.textContent = equalsTo.toFixed(2);

        });
}

currencyOptions.addEventListener('change', convertFx);
window.addEventListener('load', () => {
    currentDate.textContent = Date();
})

const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
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
            borderWidth: 1
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