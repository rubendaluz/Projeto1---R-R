
import { ip } from './config/config.js';

const button = document.getElementById('changbuton');

button.addEventListener('click', async () => {

// Capturando o token da URL
const token = getQueryParam('token');
if (!token) {
    alert('Token não encontrado.');
    return
}

// Capturando a nova senha
const newPassword = document.getElementById('newPassword').value;
if (!newPassword) {
    alert('Digite a nova senha.');
    return
}

// Enviando a nova senha para o servidor
changePassword(token, newPassword);


});

function changePassword(token, newPassword) {
    const url = `http://${ip}:4242/api/user/change-password`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
    })      
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Senha alterada com sucesso.');
            window.location.href = '../HTML/bemvindo.html';

        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
    }
    );
}




document.addEventListener('DOMContentLoaded', () => {
    const showPasswordCheckbox = document.getElementById('showPassword');
    const newPasswordInput = document.getElementById('newPassword');
    
    showPasswordCheckbox.addEventListener('change', (event) => {
        if (event.target.checked) {
            newPasswordInput.type = 'text';
        } else {
            newPasswordInput.type = 'password';
        }
    });

    
}); 

// Função para extrair parâmetros da URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
