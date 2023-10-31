document.addEventListener("DOMContentLoaded", (e) => {


const li_users = document.querySelector("#li_users");
const li_rooms = document.querySelector("#li_rooms");
const li_accesses = document.querySelector("#li_accesses");
const users_container = document.querySelector(".users_container");
const rooms_container = document.querySelector(".rooms_container");
const accesses_container = document.querySelector(".accesses_container");

li_users.addEventListener("click", (e) => {
    li_users.style.background = "grey"; 
    li_rooms.style.background = "white";
    li_accesses.style.background = "white";
    users_container.style.display = "block";
    accesses_container.style.display = "none";
    rooms_container.style.display = "none"
});

li_rooms.addEventListener("click", (e) => {
    li_users.style.background = "white"; 
    li_rooms.style.background = "grey";
    li_accesses.style.background = "white";
    users_container.style.display = "none"
    accesses_container.style.display = "none";
    rooms_container.style.display = "block"
});

li_accesses.addEventListener("click", (e) => {
    li_users.style.background = "white"; 
    li_rooms.style.background = "white";
    li_accesses.style.background = "grey";
    users_container.style.display = "none";
    accesses_container.style.display = "block";
    rooms_container.style.display = "none"
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
    document.getElementById('new_user_permission_level').value = '';
    new_user_form.style.display = "none";
}

const add_new_user_button = document.querySelector("#add_new_user_button");

add_new_user_button.addEventListener("click", (e) => {
    const user_name = document.querySelector("#new_user_name").value;
    const user_email = document.querySelector("#new_user_email").value;
    const user_permission_level = document.querySelector("#new_user_permission_level").value;
    if (!user_permission_level) {
        console.log("Permissiao dever estar entre 0-5");
    } else if (!user_name) {
        console.log("Sem username");
    } else if (!user_email) {
        console.log("Sem email para o utilizador");
    } else{
        const user_password = generatePassword();// const user_encrypted_password = encryptPassword(user_password);
        console.log(user_name, user_email, user_password);
        // Adcicionar codigo que adiciona os dados a base de dados
        //Adicionar users a tabela
        add_user_to_table(user_name, user_email, user_permission_level);
        close_new_user_form();
        // Adicionar codigo que faz refresh a pagina para atualizar os novos dados introduzidos
    }  


    const open_new_room_form_button = document.querySelector("#create_room_button");
    const new_room_form = document.querySelector(".new_room_form");

    open_new_room_form_button.addEventListener("click", (e) => {
        new_room_form.style.display = "block";
    })

    const new_room_form_close_button = document.querySelector("#new_room_form_close_button");

    new_room_form_close_button.addEventListener("click", (e) => {      
        close_new_room_form();
    });

    let close_new_room_form = () => { 
        document.getElementById('new_room_name').value = '';
        document.getElementById('new_room_security_level').value = '';
        new_room_form.style.display = "none";
    }

    const add_new_room_button = document.querySelector("#add_new_room_button");

    add_new_room_button.addEventListener("click", (e) => {
        const room_name = document.querySelector("#new_room_name").value;
        const room_security_level = document.querySelector("#new_room_email").value;
        
        if (!room_name) {
            console.log("Sem username");
        } else if (!room_security_level) {
            console.log("Sem email para o utilizador");
        } else{
            console.log(room_name,room_security_level)
            // Adcicionar codigo que adiciona os dados a base de dados
            //Adicionar users a tabela
            // add_room_to_table(room_name, room_security_level);
            close_new_room_form();
            // Adicionar codigo que faz refresh a pagina para atualizar os novos dados introduzidos
        }  
    });
});

})

let generatePassword = () => {
    return Math.random().toString(36).slice(-8);
}


function closeForm() {
    // Close the form by hiding it
    document.querySelector('.form-container').style.display = 'none';
}

let add_user_to_table = (username, useremail, permission_level) => {
    const table_body = document.querySelector("#table_body");

    table_body.innerHTML += `
        <tr>
            <td>${username}</td>
            <td>${useremail}</td>
            <td>${permission_level}</td>
            <td class="action-icons">
                <a href="#" title="Edit"><i class="fas fa-edit"></i></a>
                <a href="#" title="Delete"><i class="fas fa-trash-alt"></i></a>
            </td>
        </tr>
    `
}