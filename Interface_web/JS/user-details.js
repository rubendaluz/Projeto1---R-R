

import { ip } from './config/config.js';



const acesses_table = document.querySelector("#accesses_table_body");
var btnClearFilters = document.getElementById("btnClearFilters");

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../HTML/login.html";
    }
    var filterIcons = document.querySelectorAll(".filter-item i");
    filterIcons.forEach(function (icon) {
        icon.addEventListener("click", function () {
            var filterType = icon.getAttribute("onclick").match(/\('(.*?)'\)/)[1];
            toggleFilter(filterType);
        });
    });

    const user = JSON.parse(localStorage.getItem("user"));
    const userNameElement = document.querySelector(".user-name");
    userNameElement.textContent = user.username || "Admin";


    // Obtém o ID do usuário dos parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);



    const userId = urlParams.get('id');
    console.log(`User ID: ${userId}`);

    // Chama a função para buscar os detalhes do usuário
    getUserDetails(userId);




    applyFilters(101);
});





// Função para buscar os detalhes do usuário por ID usando fetch
const getUserDetails = (userId) => {
    const url = `http://${ip}:4242/api/user/${userId}`;

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
            document.getElementById('nfctag').textContent = userDetails.nfctag ? userDetails.nfctag : 'No tag assigned';
            document.getElementById('email').textContent = userDetails.email;
            document.getElementById('email').textContent = userDetails.email;
            document.getElementById('phone').textContent = userDetails.phone;
            document.getElementById('accessLevel').textContent = userDetails.accessLevel;
            document.getElementById('active').textContent = userDetails.active ? 'Yes' : 'No';
        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
        });
};


function formatarData(dataOriginal) {
    const data = new Date(dataOriginal);
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    const ano = data.getFullYear();
    const horas = data.getHours();
    const minutos = data.getMinutes();
    const dataFormatada = `${dia < 10 ? '0' : ''}${dia}-${mes < 10 ? '0' : ''}${mes}-${ano}`;
    const horaFormatada = `${horas < 10 ? '0' : ''}${horas}:${minutos < 10 ? '0' : ''}${minutos}`;
    const resultadoFinal = `${dataFormatada}/${horaFormatada}`;
    return resultadoFinal;
}











function clearAllFilters() {
    document.getElementById('sortColumn').value = 'id';
    document.getElementById('sortOrder').value = 'asc';
    document.getElementById('dateFilter').value = '';
    document.getElementById('methodFilter').value = '';
    document.getElementById('accessStateFilter').value = '';
    document.getElementById('areaFilter').value = '';
    applyFilters();
    if (!btnClearFilters.classList.contains("hidden")) {
        btnClearFilters.classList.toggle('hidden');
    }
    var inputs = document.querySelectorAll('.filter-input');
    // Se todos estiverem ocultos, mostra todos. Caso contrário, oculta todos.
    inputs.forEach(function (input) {
        input.classList.add('hidden');
    });

}



function toggleFilter(filterId) {
    const filterInput = document.getElementById(filterId);
    filterInput.classList.toggle('hidden');
    console.log(filterInput);
    if (btnClearFilters.classList.contains("hidden")) {
        btnClearFilters.classList.remove("hidden");
    }

}
var btnShowMoreFilters = document.getElementById("showMoreFilters");
btnShowMoreFilters.addEventListener("click", function () {
    showallFilter();
    if (btnClearFilters.classList.contains("hidden")) {
        btnClearFilters.classList.remove("hidden");
    }
});


function showallFilter() {
    var inputs = document.querySelectorAll('.filter-input');
    var shouldShow = true;

    // Verifica se pelo menos um dos inputs está visível
    inputs.forEach(function (input) {
        if (!input.classList.contains('hidden')) {
            shouldShow = false;
        }
    });

    // Se todos estiverem ocultos, mostra todos. Caso contrário, oculta todos.
    inputs.forEach(function (input) {
        if (shouldShow) {
            input.classList.remove('hidden');
        } else {
            input.classList.add('hidden');
        }
    });

}

// Attach the function to the button click event
document.getElementById('btnClearFilters').addEventListener('click', clearAllFilters);


let btnapplyFilters = document.getElementById("btnapplyFilters");
btnapplyFilters.addEventListener("click", (e) => {
    applyFilters();

});

let applyFilters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    const userFilter = userId;
    const dateFilter = document.getElementById("dateFilter").value;
    const methodFilter = document.getElementById("methodFilter").value;
    const areaFilter = document.getElementById("areaFilter").value;
    const accessStateFilter = document.getElementById("accessStateFilter").value;
    const sortColumn = document.getElementById("sortColumn").value;
    const sortOrder = document.getElementById("sortOrder").value;

    // Call a function to fetch filtered accesses based on selected filters
    getFilteredAccesses(userFilter, dateFilter, methodFilter, areaFilter, accessStateFilter, sortColumn, sortOrder);
};


let getFilteredAccesses = (userFilter, dateFilter, methodFilter, areaFilter, accessStateFilter, sortColumn, sortOrder) => {
    const baseUrl = `http://${ip}:4242/api/acesses/`;
    const url = new URL(baseUrl);


    // Add filter parameters to the URL
    if (userFilter) url.searchParams.append("userId", userFilter);
    if (dateFilter) url.searchParams.append("date", dateFilter);
    if (methodFilter) url.searchParams.append("authenticationMethod", methodFilter);
    if (areaFilter) url.searchParams.append("areaId", areaFilter);
    if (accessStateFilter) url.searchParams.append("accessState", accessStateFilter);

    // Add sorting parameters to the URL
    if (sortColumn) url.searchParams.append("sortColumn", sortColumn);
    if (sortOrder) url.searchParams.append("sortOrder", sortOrder);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(accesses => {
            // Clear existing table rows
            acesses_table.innerHTML = "";

            // Populate table with filtered accesses
            accesses.forEach(access => {
                add_access_table(access["id"], access["id_user"], access["id_area"], formatarData(access["data_hora_entrada"]), access["acesso_permitido"], access["metodo_auth"]);
            });
        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
        });
};

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



const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    //limpar user
    localStorage.removeItem("user");
    window.location.href = "../HTML/login.html";

});