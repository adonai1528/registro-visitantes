document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/dados-grafico');
  const data = await response.json();

  const labels = data.labels; // já está no formato correto
  const values = data.dados;  // os totais

  const ctx = document.getElementById('graficoVisitas').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Número de Visitas',
        data: values,
        backgroundColor: '#81a1c1',
        borderColor: '#5e81ac',
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#d8dee9' }
        },
        x: {
          ticks: { color: '#d8dee9' }
        }
      }
    }
  });
});
