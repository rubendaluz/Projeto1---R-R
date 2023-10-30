document.addEventListener("DOMContentLoaded", () => {
  const login_submit_button = document.querySelector("#login");

  //Adicionar aync a função quando descomentar o codigo de ligação a api
  login_submit_button.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    // Replace with the URL of the login endpoint
    const url = "http://localhost:4242/api/user/login";
    const data = { username, password };

    //encriptar as passwords antes de envia-las para a base de dados

    // const xhr = new XMLHttpRequest();
    // xhr.open("POST", url);
    // xhr.setRequestHeader("Content-Type", "application/json");

    // xhr.onload = function () {
    //   if (xhr.status === 200) {
    //     const response = JSON.parse(xhr.responseText);
    //     const token = response.token;

    //     localStorage.setItem("token", token);
    //     console.log(token);

    //     // Redirecione para a página com acesso restrito
    //     window.location.href = "../index.html";
    //   } else {
    //     console.error("Erro no login:", xhr.status);
    //   }
    // };

    const dataJSON = JSON.stringify(data);
    console.log(dataJSON);
    // xhr.send(dataJSON);
    //Eliminar esta linha abaixo quando descomentar o codigo de ligação a api
    window.location.href = "../index.html";
  });

});
