document.addEventListener('DOMContentLoaded', () => {

  // Obtém o ID do usuário dos parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);
  

  const userId = urlParams.get('id');
  console.log(`User ID: ${userId}`);

  // Chama a função para buscar os detalhes do usuário
  getUserDetails(userId);
});

// Função para buscar os detalhes do usuário por ID usando fetch
const getUserDetails = (userId) => {
  const url = `http://localhost:4242/api/user/${userId}`;

  fetch(url)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          return response.json();
      })
      .then(userDetails => {
          // Preenche os detalhes do usuário na página
          document.getElementById('id').textContent = userDetails.id;
          document.getElementById('firstName').textContent = userDetails.firstName;
          document.getElementById('lastName').textContent = userDetails.lastName;
          document.getElementById('nfctag').textContent = userDetails.nfctag;
          document.getElementById('fingerprint').textContent = userDetails.fingerprint;
          document.getElementById('email').textContent = userDetails.email;
          document.getElementById('phone').textContent = userDetails.phone;
          document.getElementById('accessLevel').textContent = userDetails.accessLevel;
          document.getElementById('active').textContent = userDetails.active ? 'Yes' : 'No';
      })
      .catch(error => {
          console.error(`Error: ${error.message}`);
      });
};

// Restante do código para manipular os detalhes do usuário permanece o mesmo
