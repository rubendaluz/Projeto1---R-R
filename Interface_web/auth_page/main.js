
document.addEventListener("DOMContentLoaded", () => {
  const login_submit_button = document.querySelector("#login");

  //Adicionar aync a função quando descomentar o codigo de ligação a api
  login_submit_button.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const error_message = document.querySelector(".form-error");

    console.log(username, password)
    // Replace with the URL of the login endpoint
    const url = "http://localhost:4242/api/admin/login";
    const data = { username, password };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erro no login: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const token = data.token;
    localStorage.setItem("token", token);
    console.log(token);  
    error_message.style.display = "none";
    // Redirect to the restricted access page
  window.location.href = "../HTML/dashboard.html";
  })
  .catch((error) => {
    console.error(error.message);
    error_message.innerHTML += `<p color="red"> Credenciais inválidas. Tente novamente</p>`
  });
  });

});
