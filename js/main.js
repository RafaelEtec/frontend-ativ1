const input = document.getElementById('cepInput');
const button = document.getElementById('buscarBtn');
const card = document.getElementById('cepInfo');

button.addEventListener('click', async () => {
    const cep = input.value.replace(/\D/g, '');

    if (cep.length === 8) {
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                card.innerHTML = '<p>CEP não encontrado.</p>';
            } else {
                card.innerHTML = `
                    <ul>
                    <li><span class="label">CEP:</span> ${data.cep}</li>
                    <li><span class="label">Logradouro:</span> ${data.logradouro}</li>
                    <li><span class="label">Complemento:</span> ${data.complemento}</li>
                    <li><span class="label">Bairro:</span> ${data.bairro}</li>
                    <li><span class="label">Cidade:</span> ${data.localidade}</li>
                    <li><span class="label">UF:</span> ${data.uf}</li>
                    <li><span class="label">IBGE:</span> ${data.ibge}</li>
                    <li><span class="label">GIA:</span> ${data.gia}</li>
                    <li><span class="label">DDD:</span> ${data.ddd}</li>
                    <li><span class="label">SIAFI:</span> ${data.siafi}</li>
                    </ul>
                `;
            }

            card.classList.add('fade-in-up');
        } catch (err) {
            card.innerHTML = '<p>Erro ao buscar o CEP.</p>';
            card.classList.add('fade-in-up');
        }
    } else {
        card.innerHTML = '<p>CEP inválido.</p>';
        card.classList.add('fade-in-up');
    }
});