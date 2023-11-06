
document.addEventListener("DOMContentLoaded", (e) => {


const li_users = document.querySelector("#li_users");
const li_rooms = document.querySelector("#li_rooms");
const li_accesses = document.querySelector("#li_accesses");
const users_container = document.querySelector(".users_container");
const rooms_container = document.querySelector(".rooms_container");
const accesses_container = document.querySelector(".accesses_container");
const open_new_user_form_button = document.querySelector("#create_user_button");
const new_user_form = document.querySelector(".new_user_form");
const open_new_room_form_button = document.querySelector("#create_room_button");
const new_room_form = document.querySelector(".new_room_form");    


li_users.addEventListener("click", (e) => {
    li_users.style.background = "grey"; 
    li_rooms.style.background = "white";
    li_accesses.style.background = "white";
    users_container.style.display = "block";
    accesses_container.style.display = "none";
    rooms_container.style.display = "none"
    new_room_form.style.display = "none"
});

li_rooms.addEventListener("click", (e) => {
    li_users.style.background = "white"; 
    li_rooms.style.background = "grey";
    li_accesses.style.background = "white";
    users_container.style.display = "none"
    accesses_container.style.display = "none";
    rooms_container.style.display = "block"
    new_user_form.style.display = "none"
});

li_accesses.addEventListener("click", (e) => {
    li_users.style.background = "white"; 
    li_rooms.style.background = "white";
    li_accesses.style.background = "grey";
    users_container.style.display = "none";
    accesses_container.style.display = "block";
    rooms_container.style.display = "none"
});

open_new_user_form_button.addEventListener("click", () => {
    new_user_form.style.display = "block";
});

const new_user_form_close_button = document.querySelector("#new_user_form_close_button");

new_user_form_close_button.addEventListener("click", (e) => {      
    close_new_user_form();
});

let close_new_user_form = () => { 
    document.getElementById('new_user_first_name').value = '';
    document.getElementById('new_user_last_name').value = '';
    document.getElementById('new_user_email').value = '';
    document.getElementById('new_user_phone_number').value = '';
    document.getElementById('new_user_permission_level').value = '';
    new_user_form.style.display = "none";
}

    const add_new_user_button = document.querySelector("#add_new_user_button");

    add_new_user_button.addEventListener("click", (e) => {
        const user_profile_img = document.querySelector("#new_user_profile_img").value
        const user_first_name = document.querySelector("#new_user_first_name").value;
        const user_last_name = document.querySelector("#new_user_last_name").value;
        const user_phone_number = document.querySelector("#new_user_phone_number").value;
        const user_email = document.querySelector("#new_user_email").value;
        const user_permission_level = document.querySelector("#new_user_permission_level").value;
        if (!user_permission_level) {
            console.log("Permissiao dever estar entre 0-5");
        } else if (!user_first_name) {
            console.log("Sem username");
        } else if (!user_email) {
            console.log("Sem email para o utilizador");
        } else if (!user_last_name) {
            console.log("Ultimo nome não introduzido")
        } else if (!user_phone_number) {
            console.log("Ultimo nome não introduzido")
        } else if (!user_profile_img) {
            console.log("Ultimo nome não introduzido")
        } else{
            // Adcicionar os dados a base de dados
            // URL para a qual você deseja fazer a solicitação POST
            const url = "http://localhost:4242/api/user/register/";

            // Dados que você deseja enviar no corpo da solicitação
            const data = {
                firstName: user_first_name,
                lastName: user_last_name,
                fingerPrint: null,
                nfcTag: null,
                email: user_email,
                phone: user_phone_number,
                accessLevel: user_permission_level,
                active: true,
                profilePic: user_profile_img,
            };

            console.log(data);

            // Configuração da solicitação
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Tipo de conteúdo do corpo da solicitação
            },
                body: JSON.stringify(data) // Converte os dados em JSON
            };

            // Faz a solicitação usando o fetch
            fetch(url, options)
                .then(response => {
                    if (response.ok) {
                        return response.json(); // Se a resposta for bem-sucedida, analise a resposta JSON
                    } else {
                        throw new Error('Falha na solicitação POST');
                    }
            })
            .then(data => {
                console.log(data); // Faça algo com os dados de resposta
            })
            .catch(error => {
                console.error(error); // Trate erros de solicitação
            });

            //Adicionar users a tabela
            add_user_to_table(user_profile_img,user_first_name,user_last_name,user_email,user_phone_number,user_permission_level);
            close_new_user_form();
            // Adicionar codigo que faz refresh a pagina para atualizar os novos dados introduzidos
        }  
    });
    

   open_new_room_form_button.addEventListener("click", (e) => {
        console.log("aaaa");
        e.preventDefault()
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
        const room_security_level = document.querySelector("#new_room_security_level").value;
        
        if (!room_name) {
            console.log("Sem username");
        } else if (!room_security_level) {
            console.log("Sem email para o utilizador");
        } else {
            const url = 'http://localhost:4242/api/room/';

            // Dados que você deseja enviar no corpo da solicitação
            const data = {
                roomName: room_name,
                access_level_required: room_security_level,
                description: "exemplo"
            };

            console.log(data);

            // Configuração da solicitação
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Tipo de conteúdo do corpo da solicitação
            },
                body: JSON.stringify(data) // Converte os dados em JSON
            };

            // Faz a solicitação usando o fetch
            fetch(url, options)
                .then(response => {
                    if (response.ok) {
                        return response.json(); // Se a resposta for bem-sucedida, analise a resposta JSON
                    } else {
                        throw new Error('Falha na solicitação POST');
                    }
            })
            .then(data => {
                console.log(data); // Faça algo com os dados de resposta
            })
            .catch(error => {
                console.error(error); // Trate erros de solicitação
            });
            console.log(room_name,room_security_level)
            add_room_to_table(room_name,room_security_level)
            
            close_new_room_form();
            // Adicionar codigo que faz refresh a pagina para atualizar os novos dados introduzidos
        }  
    });

    const delete_user_button = document.querySelector(".delete_user_btn");
    const confirmation_form = document.querySelector(".delete_user_form")

    let openConfirmForm = () => {
        confirmation_form.style.display = "flex";
    }

    let closeConfirmForm = () => {
        confirmation_form.style.display = "none"
    }

    let deleteUser = () => {
        const cancel_btn = document.querySelector("#cancel_btn")
        const confirm_btn = document.querySelector("#confirm_btn")

        openConfirmForm()
        cancel_btn.addEventListener("click", (e) => {
            closeConfirmForm()
        })
            
        confirm_btn.addEventListener("click", (e) => {
            console.log("deleted")
            closeConfirmForm()
        })
    }

    delete_user_button.addEventListener("click", () => {
        deleteUser();
    })

})

let generatePassword = () => {
    return Math.random().toString(36).slice(-8);
}

let add_user_to_table = (profilePic,firstName,lastName,email,phone,accessLevel) => {
    const table_body = document.querySelector("#table_body");
    const name = firstName + " " + lastName;

    table_body.innerHTML += `
        <tr>
            <td class="profile_pic">
            <img src="${profilePic}"
                                 alt="profile_pic">
                                 </td>
            <td>${name}</td>
            <td>${email}</td>
            <td>${phone}</td>
            <td>${accessLevel}</td>
            <td class="action-icons">
                <a href="#" title="Edit"><i class="fas fa-edit"></i></a>
                <a href="#" title="Delete"><i class="fas fa-trash-alt"></i></a>
            </td>
        </tr>
    `
}

let add_room_to_table = (roomname, roomseclevel) => {
    const table_body = document.querySelector("#rooms_table_body");

    table_body.innerHTML += `
        <tr>
            <td>2</td>
            <td>${roomname}</td>
            <td>${roomseclevel}</td>
            <td class="action-icons">
                <a href="#" title="Edit"><i class="fas fa-edit"></i></a>
                <a href="#" title="Delete"><i class="fas fa-trash-alt"></i></a>
            </td>
        </tr>
    `
}