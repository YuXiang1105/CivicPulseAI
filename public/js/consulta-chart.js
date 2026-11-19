const canvas = document.getElementById('graficaEvolucion');
const message = document.getElementById('graficaMensaje');

if (canvas && message) {
    const series = JSON.parse(canvas.dataset.series || '[]');

    if (series.length === 0 || series[0].data.length === 0) {
        message.textContent = series.length === 0
            ? 'Envía una consulta para ver la evolución de los datos.'
            : 'No hay datos para el año seleccionado.';
    } else if (typeof Chart !== 'undefined') {
        const chartData = series[0];
        const points = chartData.data;
        const firstYear = points[0].year;
        const lastYear = points[points.length - 1].year;

        document.getElementById('tituloGrafica').textContent =
            `${chartData.label} (${firstYear} - ${lastYear})`;
        message.textContent = 'Valores expresados en miles de personas.';

        new Chart(canvas, {
            type: 'line',
            data: {
                labels: points.map(point => point.year),
                datasets: [{
                    label: chartData.label,
                    data: points.map(point => point.value),
                    borderColor: '#ffc107',
                    backgroundColor: 'rgba(255, 193, 7, 0.18)',
                    pointBackgroundColor: '#ffc107',
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: true,
                    tension: 0.25
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    x: {
                        ticks: { color: '#adb5bd' },
                        grid: { color: 'rgba(173, 181, 189, 0.12)' },
                        title: {
                            display: true,
                            text: 'Año',
                            color: '#adb5bd'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        ticks: { color: '#adb5bd' },
                        grid: { color: 'rgba(173, 181, 189, 0.12)' },
                        title: {
                            display: true,
                            text: 'Miles de personas',
                            color: '#adb5bd'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#f8f9fa' }
                    }
                }
            }
        });
    } else {
        message.textContent = 'No se pudo cargar la biblioteca de gráficas.';
    }
}
