const canvas = document.getElementById('graficaComparacion');
const message = document.getElementById('graficaMensaje');
const modoIndividual = document.getElementById('modoIndividual');
const modoComparar = document.getElementById('modoComparar');
const btnMostrarTexto = document.getElementById('btnMostrarTexto');
const graficaTitulo = document.getElementById('graficaTitulo');

function actualizarModo() {
    const comparar = modoComparar?.checked;
    document.querySelectorAll('[data-seleccion="2"], [data-tarjeta="2"]').forEach(elemento => {
        elemento.classList.toggle('d-none', !comparar);
    });
    document.querySelectorAll('#sexo2, #comunidad2, #edad2').forEach(elemento => {
        elemento.disabled = !comparar;
    });
    if (btnMostrarTexto) {
        btnMostrarTexto.textContent = comparar ? 'Comparar selecciones' : 'Ver selección';
    }
    if (graficaTitulo) {
        graficaTitulo.textContent = comparar
            ? 'Comparación de las dos selecciones'
            : 'Evolución de la selección';
    }
}

modoIndividual?.addEventListener('change', actualizarModo);
modoComparar?.addEventListener('change', actualizarModo);
actualizarModo();

if (canvas && message) {
    const series = JSON.parse(canvas.dataset.series || '[]');
    const numero = new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
    const numeroSignado = valor => `${valor >= 0 ? '+' : '\u2212'}${numero.format(Math.abs(valor))}`;

    const kpisList = canvas.dataset.kpis
        ? JSON.parse(canvas.dataset.kpis)
        : [];

    kpisList.forEach((kpis, indice) => {
        const numeroSeleccion = indice + 1;
        const elementos = {
            anio: document.getElementById(`kpiAnio${numeroSeleccion}`),
            valor: document.getElementById(`kpiValor${numeroSeleccion}`),
            variacionTexto: document.getElementById(`kpiVariacionTexto${numeroSeleccion}`),
            variacionMovil: document.getElementById(`kpiVariacionMovil${numeroSeleccion}`),
            historicoTexto: document.getElementById(`kpiHistoricoTexto${numeroSeleccion}`),
            historicoVariacion: document.getElementById(`kpiHistoricoVariacion${numeroSeleccion}`),
            max: document.getElementById(`kpiMax${numeroSeleccion}`),
            min: document.getElementById(`kpiMin${numeroSeleccion}`)
        };

        if (kpis?.ultimo) {
            elementos.anio.textContent = kpis.ultimo.Anyo;
            elementos.valor.textContent = `${numero.format(kpis.ultimo.Valor)} mil`;

            if (kpis.variacionAbsoluta !== null && kpis.variacionPorcentual !== null) {
                const positiva = kpis.variacionAbsoluta >= 0;
                elementos.variacionMovil.textContent =
                    `${numeroSignado(kpis.variacionAbsoluta)} mil · ${numeroSignado(kpis.variacionPorcentual)}%`;
                elementos.variacionMovil.className =
                    `badge rounded-pill bg-${positiva ? 'success' : 'danger'}-subtle text-${positiva ? 'success' : 'danger'} border border-${positiva ? 'success' : 'danger'}-subtle`;
                elementos.variacionTexto.textContent = `vs. ${kpis.anterior.Anyo}`;
            } else {
                elementos.variacionMovil.textContent = 'Sin comparativa';
                elementos.variacionMovil.className = 'badge rounded-pill bg-secondary-subtle text-secondary';
                elementos.variacionTexto.textContent = 'vs. año anterior';
            }

            if (kpis.variacion2006Absoluta !== null && kpis.variacion2006Porcentual !== null) {
                const positiva = kpis.variacion2006Absoluta >= 0;
                elementos.historicoTexto.textContent = '2025 vs. 2006';
                elementos.historicoVariacion.textContent =
                    `${numeroSignado(kpis.variacion2006Absoluta)} mil · ${numeroSignado(kpis.variacion2006Porcentual)}%`;
                elementos.historicoVariacion.className =
                    `badge rounded-pill bg-${positiva ? 'success' : 'danger'}-subtle text-${positiva ? 'success' : 'danger'} border border-${positiva ? 'success' : 'danger'}-subtle`;
            } else {
                elementos.historicoTexto.textContent = '2025 vs. 2006';
                elementos.historicoVariacion.textContent = 'Sin comparativa';
                elementos.historicoVariacion.className = 'badge rounded-pill bg-secondary-subtle text-secondary';
            }
            elementos.max.textContent = kpis.maximo
                ? `${numero.format(kpis.maximo.Valor)} mil · ${kpis.maximo.Anyo}`
                : '—';
            elementos.min.textContent = kpis.minimo
                ? `${numero.format(kpis.minimo.Valor)} mil · ${kpis.minimo.Anyo}`
                : '—';
        } else {
            elementos.anio.textContent = '—';
            elementos.valor.textContent = '—';
            elementos.variacionMovil.textContent = '';
            elementos.variacionTexto.textContent = 'vs. año anterior';
            elementos.historicoTexto.textContent = '2025 vs. 2006';
            elementos.historicoVariacion.textContent = '—';
            elementos.max.textContent = '—';
            elementos.min.textContent = '—';
        }
    });

    if (series.length === 0 || series.some(serie => serie.data.length === 0)) {
        message.textContent = series.length === 0
            ? ''
            : 'No hay datos para la selección.';
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
