const li_users = document.querySelector("#li_users");
const li_rooms = document.querySelector("#li_rooms");
const li_accesses = document.querySelector("#li_accesses");
const users_container = document.querySelector(".users_container");

li_users.addEventListener("click", (e) => {
    li_users.style.background = "grey"; 
    li_rooms.style.background = "white";
    li_accesses.style.background = "white";
    users_container.style.display = "block";
});

li_rooms.addEventListener("click", (e) => {
    li_users.style.background = "white"; 
    li_rooms.style.background = "grey";
    li_accesses.style.background = "white";
    users_container.style.display = "none"
});

li_accesses.addEventListener("click", (e) => {
    li_users.style.background = "white"; 
    li_rooms.style.background = "white";
    li_accesses.style.background = "grey";
    users_container.style.display = "none"
});

const open_new_user_form_button = document.querySelector("#create_user_button");
const new_user_form = document.querySelector(".new_user_form");

open_new_user_form_button.addEventListener("click", (e) => {
    new_user_form.style.display = "block";
});

const new_user_form_close_button = document.querySelector("#new_user_form_close_button");

new_user_form_close_button.addEventListener("click", (e) => {      
    close_new_user_form();
});

let close_new_user_form = () => { 
    document.getElementById('new_user_name').value = '';
    document.getElementById('new_user_email').value = '';
    new_user_form.style.display = "none";
}

const add_new_user_button = document.querySelector("#add_new_user_button");

add_new_user_button.addEventListener("click", (e) => {
    const user_name = document.querySelector("#new_user_name").value;
    const user_email = document.querySelector("#new_user_email").value;
    const user_password = generatePassword();
    // const user_encrypted_password = encryptPassword(user_password);
    console.log(user_name, user_email, user_password);
    // Adcicionar codigo que adiciona os dados a base de dados

    //Adicionar users a tabela
    add_user_to_table(user_name, user_email);
    close_new_user_form();
    // Adicionar codigo que faz refresh a pagina para atualizar os novos dados introduzidos
});


let cardIDCounter = 1;

let generatePassword = () => {
    return Math.random().toString(36).slice(-8);
}

// let encryptPassword = (password) => {
//     // Gere um hash  para a senha
//     const saltRounds = 10; // salt rounds
//     return bcrypt.hash(password, saltRounds);
// }

function closeForm() {
    // Close the form by hiding it
    document.querySelector('.form-container').style.display = 'none';
}

let add_user_to_table = (username, useremail) => {
    const table_body = document.querySelector("#table_body");

    table_body.innerHTML += `
        <tr>
            <td>${username}</td>
            <td>${useremail}</td>
            <td class="action-icons">
                <a href="#" title="Edit"><i class="fas fa-edit"></i></a>
                <a href="#" title="Delete"><i class="fas fa-trash-alt"></i></a>
            </td>
        </tr>
    `
}