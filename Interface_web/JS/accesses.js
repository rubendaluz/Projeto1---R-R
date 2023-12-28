


document.addEventListener("DOMContentLoaded", (e) => {
    var currentPage = window.location.pathname.split('/').pop();

        document.querySelectorAll('.menu_buttons').forEach(function(button) {
            var buttonHref = button.querySelector('a').getAttribute('href');
            
            if (currentPage === buttonHref) {
                button.classList.add('active');
            }
        });
  
   getAllRecentAccesses();
})













let getAllRecentAccesses = () => {
    const url = 'http://localhost:4242/api/acesses/';

    fetch(url)
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(accesses => {
        console.log(accesses);
        accesses.forEach(access => {
            add_access_table(access["id"],access["id_user"],access["id_area"],formatarData(access["data_hora_entrada"]), access["acesso_permitido"], access["metodo_auth"])
        });
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
    });
}
const acesses_table = document.querySelector("#accesses_table_body");
let add_access_table = (id, user_id, room_id, datetime, allowed, method) => {
    let allow;
    let color;
    if (allowed) {
        allow = "Allowed";
        color = "green"
    } else {
        allow = "Not Allowed"
        color = "red"
    }
    acesses_table.innerHTML += `
        <tr>
            <td>${id}</td>
            <td>${user_id}</td>
            <td>${room_id}</td>
            <td>${datetime}</td>
            <td style="background-color: ${color}; 
                color:white;">${allow}</td>
            <td>${method}</td>
        </tr>
    `
}


function formatarData(dataOriginal) { 

    // Criar um objeto Date a partir da string original
    const data = new Date(dataOriginal);
    
    // Obter os componentes da data
        const dia = data.getDate();
        const mes = data.getMonth() + 1; // Adicionar 1 porque os meses começam do zero
        const ano = data.getFullYear();
        const horas = data.getHours();
        const minutos = data.getMinutes();
    
        // Formatar os componentes da data e hora como desejado
        const dataFormatada = `${dia < 10 ? '0' : ''}${dia}-${mes < 10 ? '0' : ''}${mes}-${ano}`;
        const horaFormatada = `${horas < 10 ? '0' : ''}${horas}:${minutos < 10 ? '0' : ''}${minutos}`;
    
        // Resultado final
        const resultadoFinal = `${dataFormatada}/${horaFormatada}`;
        return resultadoFinal
    }