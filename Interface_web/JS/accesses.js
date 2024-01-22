const ip = "192.168.1.189";

const acesses_table = document.querySelector("#accesses_table_body");

document.addEventListener("DOMContentLoaded", (e) => {
  

    getAllRecentAccesses();
});

let applyFilters = () => {
    const userFilter = document.getElementById("userFilter").value;
    const dateFilter = document.getElementById("dateFilter").value;
    const methodFilter = document.getElementById("methodFilter").value;
    const areaFilter = document.getElementById("areaFilter").value;
    const accessStateFilter = document.getElementById("accessStateFilter").value;
    const sortColumn = document.getElementById("sortColumn").value;
    const sortOrder = document.getElementById("sortOrder").value;

    // Call a function to fetch filtered accesses based on selected filters
    getFilteredAccesses(userFilter, dateFilter, methodFilter, areaFilter, accessStateFilter, sortColumn, sortOrder);
};

let getAllRecentAccesses = () => {
    const url = `http://${ip}:4242/api/acesses/`;

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
                add_access_table(access["id"], access["id_user"], access["id_area"], formatarData(access["data_hora_entrada"]), access["acesso_permitido"], access["metodo_auth"]);
            });
        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
        });
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
        color = "green";
    } else {
        allow = "Not Allowed";
        color = "red";
    }
    acesses_table.innerHTML += `
        <tr>
            <td>${id}</td>
            <td>${user_id}</td>
            <td>${room_id}</td>
            <td>${datetime}</td>
            <td style="background-color: ${color}; color:white;">${allow}</td>
            <td>${method}</td>
        </tr>
    `;
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
