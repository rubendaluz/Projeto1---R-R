
// ****************************************************************************************************
// Declaracoes de variaveis globais
// ****************************************************************************************************
const usersTableBody = document.getElementById("users_table_body");
const open_new_user_form_button = document.querySelector("#create_user_button");
const add_edit_user_form = document.querySelector(".new_user_form");
const new_user_form_close_button = document.querySelector("#new_user_form_close_button");
const add_new_user_button = document.querySelector("#add_new_user_button");
import { ip } from './config/config.js';

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    //limpar user
    localStorage.removeItem("user");
    window.location.href = "../HTML/login.html";

});

// ****************************************************************************************************
// Event Listeners
// ****************************************************************************************************
document.addEventListener("DOMContentLoaded", (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../HTML/login.html";
    }
    const user = JSON.parse(localStorage.getItem("user"));
    const userNameElement = document.querySelector(".user-name");
    userNameElement.textContent = user.username || "Admin";



    getAllUsers()
 
})
usersTableBody.addEventListener("click", handleUserClick);
open_new_user_form_button.addEventListener("click", toggleNewUserForm);
new_user_form_close_button.addEventListener("click", toggleNewUserForm);
add_new_user_button.addEventListener("click", add_or_edit_user);




document.getElementById('sortOrder').onchange = function () {
    getAllUsers()
};




// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Funcoes 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function add_or_edit_user() {

    const user_first_name = document.querySelector("#new_user_first_name").value;
    const user_last_name = document.querySelector("#new_user_last_name").value;
    const user_phone_number = document.querySelector("#new_user_phone_number").value;
    const user_email = document.querySelector("#new_user_email").value;
    const user_permission_level = document.querySelector("#new_user_permission_level").value;
    const password = gerarSenhaForte();
    // Check if you are in edit mode or add mode
    const isEditMode = add_edit_user_form.getAttribute("data-edit-mode") === "true";
    let userId = document.querySelector(".new_user_form").getAttribute("userId");
    
    const formData = new FormData();
    const profileImgInput = document.getElementById('new_user_profile_img');
    console.log(profileImgInput.files[0]);
    if (profileImgInput.files.length > 0) {
        formData.append('photo', profileImgInput.files[0]);
    }

    formData.append('firstName', user_first_name);
    formData.append('lastName', user_last_name);
    formData.append('phone', user_phone_number);
    formData.append('email', user_email);
    formData.append('accessLevel', user_permission_level);
    formData.append('password', password);
    formData.append('active', 1);
    formData.append('fingerPrint', null);
    formData.append('nfcTag', null);


    // URL for API endpoint
    const url = isEditMode ? `http://${ip}:4242/api/user/update/${userId}` : `http://${ip}:4242/api/user/register/`;

    // HTTP method for API request
    const method = isEditMode ? "PUT" : "POST";

    // Configuration for the fetch request
    const options = {
        method: method,
        body: formData,
        
    };

    fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to make the API request');
            }
        })
        .then(data => {
            console.log(data); // Handle the response data
            toggleNewUserForm();
            getAllUsers ();

        })
        .catch(error => {
            console.error(error);
        });

    // Additional code for updating the table, closing the form, etc.
}


function handleUserClick(event) {
    const target = event.target;

    const clickedRow = event.target.closest('tr');

    const id = clickedRow.querySelector('td:nth-child(1)').textContent;

    // Verifica se o clique ocorreu em um ícone de ação
    if (target.classList.contains("delete_user_btn")) {
        deleteUser(id);
    } else if (target.classList.contains("edit_user_btn")) {

        add_edit_user_form.setAttribute("data-edit-mode", "true");
        add_edit_user_form.setAttribute("userId", id);
        setEditUserFormData(id);
        toggleNewUserForm();
    } else {
        window.location.href = `../HTML/user_details.html?id=${id}`;
    }
}

let add_user_to_table = (id, profilePic, firstName, lastName, email, phone, accessLevel) => {
    const table_body = document.querySelector("#users_table_body");
    const name = firstName + " " + lastName;

    table_body.innerHTML += `
        <tr>
           
            <td>${id}</td>
            <td class="profile_pic">
            <img src="../img/User/${profilePic}"
                                 alt="profile_pic">
                                 </td>
            <td>${name}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${accessLevel}</td>
            <td class="action-icons">
                <a href="#" title="Edit"><i class="fas fa-edit edit_user_btn"></i></a>
                <a href="#" title="Delete"><i class="fas fa-trash-alt delete_user_btn"></i></a>
            </td>
        </tr>
    `
}

let getAllUsers = () => {
    const baseUrl = `http://${ip}:4242/api/user/`;
    const url = new URL(baseUrl);
    const sortOrder = document.getElementById("sortOrder").value;
    if (sortOrder) url.searchParams.append("sortOrder", sortOrder);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(users => {
   
            const tableBody = document.getElementById("users_table_body");
            tableBody.innerHTML = "";

            if (users && users.length > 0) {
                users.forEach(user => {
                    add_user_to_table(user["id"], user["photopath"], user["firstName"], user["lastName"], user["email"], user["phone"], user["accessLevel"]);
                });
            } else {
                console.log("Nenhum usuário encontrado na resposta da API.");
            }
        })
        .catch(error => {
            console.error(`Erro ao obter usuários: ${error.message}`);
        });
}


function deleteUser(userId) {
    const cancel_btn = document.querySelector("#cancel_btn")
    const confirm_btn = document.querySelector("#confirm_btn")
    const confirmation_form = document.querySelector(".delete_user_form")
    confirmation_form.style.display = "flex";


    cancel_btn.addEventListener("click", (e) => {
        confirmation_form.style.display = "none";

    })

    confirm_btn.addEventListener("click", (e) => {
        const apiUrl = `http://${ip}:4242/api/user/${userId}`;

        fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log('User deleted successfully');
                confirmation_form.style.display = "none";
                getAllUsers ();

            })
            .catch(error => {
                console.error('Error during user deletion:', error);
            });

    })
}

function setEditUserFormData(id) {
    document.querySelector("#add_new_user_button").textContent = "Update User";
    document.querySelector("#title_add_edit_user_form").textContent = "Edit User";

    const url = `http://${ip}:4242/api/user/${id}`;


    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        })
        .then(user => {
            console.log(user);

            const imagePath = user.photopath ? `../img/User/${user.photopath}` : '../img/perfil.jpg';
            document.querySelector("#preview-image").src = imagePath;
            document.querySelector("#new_user_first_name").value = user.firstName;
            document.querySelector("#new_user_last_name").value = user.lastName;
            document.querySelector("#new_user_phone_number").value = user.phone;
            document.querySelector("#new_user_email").value = user.email;
            document.querySelector("#new_user_permission_level").value = user.accessLevel;


        })
        .catch(error => {
            console.error(`Error: ${error.message}`);
        });


}






function toggleNewUserForm() {

    if (add_edit_user_form.style.display == "none") {
        add_edit_user_form.style.display = "block";
    } else {
        add_edit_user_form.style.display = "none";
        clear_new_user_form();
        add_edit_user_form.setAttribute("data-edit-mode", "false");
    }
}


let clear_new_user_form = () => {
    document.getElementById('new_user_first_name').value = '';
    document.getElementById('new_user_last_name').value = '';
    document.getElementById('new_user_email').value = '';
    document.getElementById('new_user_phone_number').value = '';
    document.getElementById('new_user_permission_level').value = '';
}


function gerarSenhaForte() {
    // Definir os caracteres permitidos na senha
    const caracteresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    let senha = "";
    let comprimento = 12;

    // Gerar a senha com base no comprimento fornecido
    for (let i = 0; i < comprimento; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteresPermitidos.length);
        senha += caracteresPermitidos.charAt(indiceAleatorio);
    }

    return senha;
}



document.getElementById('new_user_profile_img').onchange = function () {
    previewImage(this);
};
function previewImage(input) {
    let preview = document.getElementById('preview-image');
    let file = input.files[0];
    let reader = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "../img/perfil.jpg"; // Default image when no file is selected
    }
}