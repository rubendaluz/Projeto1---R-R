
import { ip } from './config/config.js';

// Função para extrair parâmetros da URL
        function getQueryParam(param) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        }
    
        // Capturando o token da URL
        const token = getQueryParam('token');
        document.getElementById('changePasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const newPassword = document.getElementById('newPassword').value;
      
        try {
            const response = await fetch(`http://${ip}:4242/api/user/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword })
            });

            if(response.ok) {
                alert('Senha alterada com sucesso.');
            } else {
                alert('Falha ao mudar a senha.');
            }
        } catch (error) {
            alert('Erro ao enviar a solicitação.');
        }
    });
    