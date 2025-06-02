document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('login').style.display = 'none';
            document.getElementById('listagem').style.display = 'block';
            loadAposentados();
        } else {
            alert('Login falhou!');
        }
    });
});

function loadAposentados() {
    fetch('/api/aposentados')
        .then(response => response.js())
        .then(data => {
            const table = document.getElementById('table');
            table.innerHTML = '<tr><th>ID</th><th>Nome</th><th>Número do Benefício</th><th>Data de Nascimento</th><th>Data de Aposentadoria</th><th>Verificar Desconto</th></tr>';
            data.forEach(aposentado => {
                const row = table.insertRow();
                row.insertCell(0).innerText = aposentado.id;
                row.insertCell(1).innerText = aposentado.nome;
                row.insertCell(2).innerText = aposentado.numeroBeneficio;
                row.insertCell(3).innerText = aposentado.dataNascimento;
                row.insertCell(4).innerText = aposentado.dataAposentadoria;
                const button = document.createElement('button');
                button.innerText = 'Verificar';
                button.onclick = () => verificarDesconto(aposentado.cpf);
                row.insertCell(5).appendChild(button);
            });
        });
}

function verificarDesconto(cpf) {
    fetch(`/api/descontos?cpf=${cpf}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const desconto = data[0];
                if (confirm(`Desconto encontrado: ${desconto.nome} - R$ ${desconto.valor}. Deseja cancelar?`)) {
                    cancelarDesconto(desconto.id);
                }
            } else {
                alert('Não existe desconto para este aposentado/pensionista.');
            }
        });
}

function cancelarDesconto(id) {
    fetch(`/api/descontos/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        alert('Desconto cancelado com sucesso!');
        loadAposentados();
    });
}
