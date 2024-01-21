document.addEventListener("DOMContentLoaded", () => {
    const totalUsersCountElement = document.getElementById("totalUsersCount");
    const totalAdminsCountElement = document.getElementById("totalAdminsCount");
    const totalRoomsCountElement = document.getElementById("totalRoomsCount");
    const ip = "192.168.170.94"

    // Use a rota configurada no seu servidor
    const apiUrl = `http://${ip}:4242/api/statistics`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Atualize os elementos HTML com os dados recebidos
            totalUsersCountElement.textContent = data.usersCount;
            totalAdminsCountElement.textContent = data.adminsCount;
            totalRoomsCountElement.textContent = data.roomsCount;
        })
        .catch(error => console.error("Error fetching data:", error));
});
