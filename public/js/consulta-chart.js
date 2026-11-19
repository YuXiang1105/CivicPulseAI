const canvas = document.getElementById('graficaComparacion');
const message = document.getElementById('graficaMensaje');

if (canvas && message) {
    const series = JSON.parse(canvas.dataset.series || '[]');

    if (series.length !== 2 || series.some(serie => serie.data.length === 0)) {
        message.textContent = series.length === 0
            ? 'Envía las dos selecciones para ver la comparación.'
            : 'No hay datos para una o ambas selecciones.';
    } else if (typeof Chart === 'undefined') {
        message.textContent = 'No se pudo cargar la biblioteca de gráficas.';
    } else {
        const years = [...new Set(series.flatMap(serie => serie.data.map(point => point.year)))]
            .sort((a, b) => a - b);
        const colors = [
            { line: '#ffc107', area: 'rgba(255, 193, 7, 0.28)' },
            { line: '#0dcaf0', area: 'rgba(13, 202, 240, 0.32)' }
        ];

        message.textContent = 'Valores en miles de personas. El área superior se rellena entre ambas líneas.';

        new Chart(canvas, {
            type: 'line',
            data: {
                labels: years,
                datasets: series.map((serie, index) => ({
                    label: serie.label,
                    data: years.map(year =>
                        serie.data.find(point => point.year === year)?.value ?? null
                    ),
                    borderColor: colors[index].line,
                    backgroundColor: colors[index].area,
                    borderWidth: 2,
                    pointRadius: 2,
                    pointHoverRadius: 5,
                    fill: index === 0 ? 'origin' : '-1',
                    tension: 0,
                    spanGaps: false
                }))
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
                        beginAtZero: true,
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
                        position: 'bottom',
                        labels: { color: '#f8f9fa' }
                    },
                    tooltip: {
                        callbacks: {
                            label: context =>
                                `${context.dataset.label}: ${context.parsed.y ?? 'sin dato'}`
                        }
                    }
                }
            }
        });
    }
}
