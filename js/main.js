const input = document.getElementById('cepInput');
const button = document.getElementById('buscarBtn');
const card = document.getElementById('cepInfo');

const OPENWEATHER_API_KEY = '1e4f2386846b19aa03f149464cfe7415';

button.addEventListener('click', async () => {
    const cep = input.value.trim().replace(/\D/g, '');
    card.classList.remove('fade-in-up');
    card.innerHTML = '<p>Carregando informações...</p>';

    if (cep.length === 8) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                card.innerHTML = '<p>CEP não encontrado.</p>';
            } else {
                const cidade = data.localidade;
                const uf = data.uf;

                const weatherRes = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${cidade},${uf},BR&units=metric&lang=pt_br&appid=${OPENWEATHER_API_KEY}`
                );
                const weatherData = await weatherRes.json();

                let climaHTML = '';
                if (weatherData.cod === 200) {
                    const iconCode = weatherData.weather[0].icon;
                    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                    climaHTML = `
                        <li>
                            <span class="label">Clima:</span>
                            <img class="clima-icon" src="${iconUrl}" alt="Clima" />
                            ${weatherData.weather[0].description}
                        </li>
                        <li><span class="label">Temperatura:</span> ${weatherData.main.temp} °C</li>
                        <li><span class="label">Sensação térmica:</span> ${weatherData.main.feels_like} °C</li>
                        <li><span class="label">Umidade:</span> ${weatherData.main.humidity}%</li>
                    `;
                } else {
                    climaHTML = `<li><span class="label">Clima:</span> Não disponível (${weatherData.message})</li>`;
                }

                card.innerHTML = `
                    <ul>
                        <li><span class="label">CEP:</span> ${data.cep}</li>
                        <li><span class="label">Logradouro:</span> ${data.logradouro}</li>
                        <li><span class="label">Complemento:</span> ${data.complemento || 'N/A'}</li>
                        <li><span class="label">Bairro:</span> ${data.bairro}</li>
                        <li><span class="label">Cidade:</span> ${data.localidade}</li>
                        <li><span class="label">UF:</span> ${data.uf}</li>
                        ${climaHTML}
                    </ul>
                `;
            }

            card.classList.add('fade-in-up');
        } catch (err) {
            console.error(err);
            card.innerHTML = '<p>Erro ao buscar o CEP ou clima.</p>';
            card.classList.add('fade-in-up');
        }
    } else {
        card.innerHTML = '<p>CEP inválido. Digite 8 números.</p>';
        card.classList.add('fade-in-up');
    }
});