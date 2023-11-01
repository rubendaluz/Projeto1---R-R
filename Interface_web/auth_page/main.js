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

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Erro no login: " + response.status);
      }
    })
    .then(data => {
      const token = data.token;
      localStorage.setItem("token", token);
      console.log(token);

      // Redirecione para a página com acesso restrito
      window.location.href = "../index.html";
    })
    .catch(error => {
      console.error(error.message);
    });


    const dataJSON = JSON.stringify(data);
    console.log(dataJSON);

    //Eliminar esta linha abaixo quando descomentar o codigo de ligação a api
    // window.location.href = "../index.html";
  });

});
